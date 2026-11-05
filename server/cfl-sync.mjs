import { createHash } from 'node:crypto';
import { failure, validateState } from './security.mjs';
const idFor = (kind,id) => `cfl-${kind}-${createHash('sha256').update(id).digest('hex').slice(0,24)}`;
const text = (value,max=200) => typeof value==='string'?value.trim().slice(0,max):'';
const phoneKey = value => { const digits=text(value,40).replace(/\D/g,''); return digits.length===12&&digits.startsWith('91')?digits.slice(2):digits; };
export function mergeCflFeed(original,feed,mappings={}) {
  if(feed?.version!==1||!Array.isArray(feed.workshops)||!Array.isArray(feed.registrations)||feed.workshops.length>5000||feed.registrations.length>50000) throw failure(502,'CFL returned an invalid registration feed.');
  const data=structuredClone(original); const result={workshopsCreated:0,participantsCreated:0,existing:0,skipped:0};
  const links=new Map(); const seen=new Set();
  for(const source of feed.workshops){
    const externalId=text(source?.id);if(!externalId||seen.has(externalId)||!text(source.title)) throw failure(502,'CFL returned invalid or duplicate workshop identifiers.');seen.add(externalId);
    const mapped=mappings[externalId];
    let batch=data.batches.find(b=>b.id===(mapped||idFor('workshop',externalId)));
    if(mapped&&!batch) throw failure(409,'A mapped PAW workshop no longer exists. Update the CFL mapping.');
    if(!batch){
      const start=text(source.startDate,10),end=text(source.endDate,10);
      const dated=/^\d{4}-\d{2}-\d{2}$/.test(start)&&/^\d{4}-\d{2}-\d{2}$/.test(end)&&end>=start;
      batch={id:idFor('workshop',externalId),name:text(source.title),code:`CFL-${idFor('',externalId).slice(-8).toUpperCase()}`,type:source.type==='Online'?'Online':'Offline',venueOrLink:text(source.venue,1000),startDate:dated?start:'',endDate:dated?end:'',welcomeStartDate:dated?start:'',pawHeadId:data.members.find(m=>m.role==='PAW_HEAD')?.id||'',status:'Draft',totalTargetRegistrations:100,createdAt:new Date().toISOString(),cflWorkshopId:externalId};
      data.batches.push(batch);result.workshopsCreated++;
    }
    links.set(externalId,batch);
  }
  const registrationIds=new Set();
  for(const source of feed.registrations){
    const externalId=text(source?.id),batch=links.get(text(source?.workshopId));
    const phone=phoneKey(source?.mobile),name=text(source?.fullName,120);
    if(!externalId||registrationIds.has(externalId)||!batch||!name||!/^\d{10,15}$/.test(phone)){result.skipped++;continue;}registrationIds.add(externalId);
    let participant=data.participants.find(p=>p.id===idFor('person',externalId)||p.cflRegistrationId===externalId||p.cflRegistrationIds?.includes(externalId));
    if(participant&&participant.pawBatchId!==batch.id) throw failure(409,'A CFL registration is already linked to another PAW workshop. Keep its existing mapping.');
    participant??=data.participants.find(p=>p.pawBatchId===batch.id&&phoneKey(p.phone)===phone);
    if(participant){
      participant.cflRegistrationIds=[...new Set([...(participant.cflRegistrationIds||[]),externalId])];
      participant.cflWorkshopId=text(source.workshopId);participant.cflRegistrationId ||= externalId;
      participant.cflRegistrationStatus=text(source.registrationStatus)||'confirmed';
      if(participant.registrationStatus==='Provisional'&&source.registrationStatus==='confirmed')participant.registrationStatus='Confirmed';
      result.existing++;continue;
    }
    const candidates=data.members.filter(m=>m.team==='WELCOME_FOLLOWUP'&&m.isAvailable).sort((a,b)=>data.participants.filter(p=>p.assignedWelcomeIclMemberId===a.id).length-data.participants.filter(p=>p.assignedWelcomeIclMemberId===b.id).length||a.id.localeCompare(b.id));
    data.participants.push({id:idFor('person',externalId),loginId:`CFL-${idFor('person',externalId).slice(-16).toUpperCase()}`,pawBatchId:batch.id,fullName:name,phone,whatsappNumber:phone,email:text(source.email),city:text(source.city),preferredLanguage:'en',registeredAt:text(source.createdAt,40)||new Date().toISOString(),registrationStatus:source.registrationStatus==='waiting'?'Provisional':'Confirmed',whatsappGroupJoined:false,assignedWelcomeIclMemberId:candidates[0]?.id||'',welcomeCallStatus:'Pending',welcomeChecklist:{verified:false,datesConfirmed:false,whatsappConfirmed:false,firstAssignmentGuided:false,techSupportProvided:false,doubtsCleared:false,attendanceConfirmed:false},firstAssignmentStatus:'Not_Started',followups:[],cflWorkshopId:text(source.workshopId),cflRegistrationId:externalId,cflRegistrationIds:[externalId],cflRegistrationNumber:text(source.registrationNumber),cflRegistrationStatus:text(source.registrationStatus)||'confirmed'});
    result.participantsCreated++;
  }
  validateState(data);
  return {data,result};
}
export function installCflSync({db,readState,writeState,audit,baseUrl,token,fetchImpl=fetch,intervalMs=60000}){
  db.exec("CREATE TABLE IF NOT EXISTS cfl_sync (id INTEGER PRIMARY KEY CHECK(id=1), value TEXT NOT NULL)");
  db.prepare('INSERT OR IGNORE INTO cfl_sync VALUES(1,?)').run(JSON.stringify({mappings:{},workshops:[],lastSuccess:null,lastAttempt:null,error:'',result:null}));
  const read=()=>JSON.parse(db.prepare('SELECT value FROM cfl_sync WHERE id=1').get().value);
  const save=value=>db.prepare('UPDATE cfl_sync SET value=? WHERE id=1').run(JSON.stringify(value));
  const configured=Boolean(baseUrl&&token);let running=null;
  const status=()=>({...read(),configured,running:Boolean(running),source:baseUrl||'',intervalSeconds:intervalMs/1000});
  const sync=()=>{
    if(running)return running;
    running=(async()=>{
      if(!configured)throw failure(503,'Connect the CFL server before syncing.');
      save({...read(),lastAttempt:new Date().toISOString()});
      try{
        const url=new URL('/api/v1/paw',baseUrl);
        if(url.protocol!=='https:'&&!(url.protocol==='http:'&&['127.0.0.1','localhost'].includes(url.hostname)))throw new Error('CFL must use HTTPS.');
        const response=await fetchImpl(url,{headers:{Authorization:`Bearer ${token}`},redirect:'error',signal:AbortSignal.timeout(20000)});
        if(!response.ok)throw new Error(`CFL connection failed (${response.status}). Check the server connection and API key.`);
        let size=0;const chunks=[];for await(const chunk of response.body){size+=chunk.length;if(size>8*1024*1024)throw new Error('CFL feed exceeds 8 MB. Narrow the workshop selection.');chunks.push(chunk);}
        const feed=JSON.parse(Buffer.concat(chunks).toString());
        db.exec('BEGIN IMMEDIATE');
        try{
          const current=readState();const settings=read();const merged=mergeCflFeed(current.data,feed,settings.mappings);
          if(JSON.stringify(merged.data)!==JSON.stringify(current.data))writeState(merged.data,current.revision+1);
          save({...settings,lastSuccess:new Date().toISOString(),error:'',result:merged.result,workshops:feed.workshops.map(w=>({id:w.id,title:w.title,pawBatchId:settings.mappings[w.id]||idFor('workshop',w.id)}))});
          audit(null,'cfl_sync_completed');db.exec('COMMIT');
        }catch(error){db.exec('ROLLBACK');throw error;}
      }catch(error){save({...read(),error:error.status?error.message:'Unable to sync CFL. Check the connection, API key and server logs.'});throw failure(error.status||502,read().error);}
      return status();
    })().finally(()=>{running=null;});return running;
  };
  const map=(externalId,batchId)=>{
    if(running)throw failure(409,'A sync is running. Try again shortly.');
    const settings=read(),data=readState().data;
    if(!settings.workshops.some(w=>w.id===externalId)||!data.batches.some(b=>b.id===batchId))throw failure(400,'Choose an existing CFL and PAW workshop.');
    const old=settings.workshops.find(w=>w.id===externalId).pawBatchId;
    if(old!==batchId&&data.participants.some(p=>p.cflWorkshopId===externalId))throw failure(409,'This workshop already has imported participants. Its mapping cannot be changed.');
    settings.mappings[externalId]=batchId;settings.workshops=settings.workshops.map(w=>w.id===externalId?{...w,pawBatchId:batchId}:w);save(settings);return status();
  };
  const timer=configured?setInterval(()=>void sync().catch(()=>{}),intervalMs):null;timer?.unref();
  return {status,sync,map,start:()=>{if(configured)void sync().catch(()=>{});},close:async()=>{if(timer)clearInterval(timer);if(running)await running.catch(()=>{});}};
}
