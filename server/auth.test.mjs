import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { createApp } from './app.mjs';
const temporary='Synthetic temporary phrase 123';
const personal='Synthetic personal phrase 456';
async function environment(options={}) {
  const server=await createApp({dbPath:':memory:',...options});server.listen(0,'127.0.0.1');await once(server,'listening');
  const base=`http://127.0.0.1:${server.address().port}`;
  function client(){let cookie='';return{request:async(path,method='GET',body,headers={})=>{
    const response=await fetch(base+path,{method,headers:{...(method!=='GET'?{'Content-Type':'application/json',Origin:base}:{}),...(cookie?{Cookie:cookie}:{}),...headers},...(body===undefined?{}:{body:JSON.stringify(body)})});
    const setCookie=response.headers.get('set-cookie');if(setCookie)cookie=setCookie.split(';')[0];
    return {status:response.status,body:await response.json(),cookie:setCookie};
  }};}
  return {server,client,base,close:async()=>{server.close();await once(server,'close');}};
}
async function owner(env){const admin=env.client();const result=await admin.request('/api/auth/setup','POST',{name:'Test PAW Head',username:'test.owner',password:personal});assert.equal(result.status,201);return admin;}
const patch=async(client,snapshot,changes)=>client.request('/api/state','PATCH',{revision:snapshot.revision,changes});
async function fixture(env){
  const admin=await owner(env);const snapshot=(await admin.request('/api/state')).body;
  const members=[['caller-1','CALLING_MEMBER','CALLING'],['caller-2','CALLING_MEMBER','CALLING'],['welcome-1','WELCOME_MEMBER','WELCOME_FOLLOWUP'],['welcome-2','WELCOME_MEMBER','WELCOME_FOLLOWUP'],['leader-1','LEADER','LEADERSHIP'],['leaderhead-1','LEADER_HEAD','LEADERSHIP']].map(([id,role,team])=>({id,name:id,phone:'',email:'',role,team,isAvailable:true,callingCapacity:25,parentLeaderId:role==='LEADER_HEAD'?snapshot.data.members[0].id:role==='LEADER'?'leaderhead-1':'leader-1'}));
  const batch={id:'batch-one',name:'Test workshop',code:'TEST',type:'Online',venueOrLink:'',pawHeadId:snapshot.data.members[0].id,startDate:'2026-10-18',endDate:'2026-10-20',welcomeStartDate:'2026-10-11',status:'Calling',totalTargetRegistrations:100,createdAt:'2026-10-09'};
  const leads=[1,2].map(i=>({id:`lead-${i}`,pawBatchId:batch.id,fullName:`Contact ${i}`,phone:`999999999${i}`,city:'',assignedMemberId:`caller-${i}`,callStatus:'PENDING',callLogs:[]}));
  const participants=[1,2].map(i=>({id:`participant-${i}`,loginId:`TEST-${i}`,pawBatchId:batch.id,fullName:`Person ${i}`,phone:`888888888${i}`,whatsappNumber:`888888888${i}`,preferredLanguage:'en',city:'',registeredAt:'2026-10-09',registrationStatus:'Confirmed',whatsappGroupJoined:false,assignedCallingMemberId:`caller-${i}`,assignedWelcomeIclMemberId:`welcome-${i}`,welcomeCallStatus:'Pending',welcomeChecklist:{verified:false,datesConfirmed:false,whatsappConfirmed:false,firstAssignmentGuided:false,techSupportProvided:false,doubtsCleared:false,attendanceConfirmed:false},firstAssignmentStatus:'Not_Started',followups:[]}));
  assert.equal((await patch(admin,snapshot,{batches:{upsert:[batch],remove:[]},members:{upsert:members,remove:[]},leads:{upsert:leads,remove:[]},participants:{upsert:participants,remove:[]}})).status,200);
  async function login(role,entityId,username=entityId){
    const created=await admin.request('/api/accounts','POST',{username,role,password:temporary,...(role==='PARTICIPANT'?{participantId:entityId}:{memberId:entityId})});assert.equal(created.status,201,created.body.error);
    const client=env.client();const result=await client.request('/api/auth/login','POST',{username,password:temporary});assert.equal(result.status,200);
    assert.equal((await client.request('/api/state')).status,403);
    const changed=await client.request('/api/auth/password','POST',{currentPassword:temporary,newPassword:personal});assert.equal(changed.status,200);assert.equal(changed.body.user.mustChangePassword,false);
    return {client,account:created.body.account};
  }
  return {admin,login};
}

test('first account, strong passwords, session cookie, generic login failure, logout',async()=>{
  const env=await environment();try{
    const client=env.client();assert.equal((await client.request('/api/state')).status,401);
    assert.equal((await client.request('/api/auth/status')).body.setupRequired,true);
    assert.equal((await client.request('/api/auth/setup','POST',{username:'owner',name:'Owner',password:'short'})).status,400);
    const result=await client.request('/api/auth/setup','POST',{username:'owner',name:'Owner',password:personal});assert.equal(result.status,201);assert.match(result.cookie,/HttpOnly/);assert.match(result.cookie,/SameSite=Strict/);
    assert.equal((await client.request('/api/auth/setup','POST',{username:'another',name:'Other',password:personal})).status,409);
    assert.equal((await env.client().request('/api/auth/login','POST',{username:'missing',password:'wrong'})).body.error,'Login ID or password is incorrect.');
    assert.equal((await client.request('/api/auth/logout','POST',{})).status,200);assert.equal((await client.request('/api/state')).status,401);
  }finally{await env.close();}
});
test('CSRF origin checks reject cross-origin mutations and missing origin',async()=>{
  const env=await environment();try{const admin=await owner(env);assert.equal((await admin.request('/api/auth/logout','POST',{}, {Origin:'https://attacker.example'})).status,403);assert.equal((await admin.request('/api/auth/logout','POST',{}, {Origin:''})).status,403);assert.equal((await admin.request('/api/state')).status,200);}finally{await env.close();}
});
test('calling login is scoped and cannot access accounts or change another member lead',async()=>{
  const env=await environment();try{const {login}=await fixture(env);const {client}=await login('CALLING_MEMBER','caller-1');const snapshot=(await client.request('/api/state')).body;assert.deepEqual(snapshot.data.leads.map(l=>l.id),['lead-1']);assert.deepEqual(snapshot.data.participants.map(p=>p.id),['participant-1']);assert.equal((await client.request('/api/accounts')).status,403);
    const own=snapshot.data.leads[0];assert.equal((await patch(client,snapshot,{leads:{upsert:[{...own,id:'lead-2'}],remove:[]}})).status,403);
    assert.equal((await patch(client,snapshot,{leads:{upsert:[{...own,assignedMemberId:'caller-2'}],remove:[]}})).status,403);
    assert.equal((await patch(client,snapshot,{leads:{upsert:[{...own,callStatus:'INTERESTED'}],remove:[]}})).status,200);
  }finally{await env.close();}
});
test('welcome login cannot reassign ownership or edit another participant',async()=>{
  const env=await environment();try{const {login}=await fixture(env);const {client}=await login('WELCOME_MEMBER','welcome-1');const snapshot=(await client.request('/api/state')).body;assert.deepEqual(snapshot.data.participants.map(p=>p.id),['participant-1']);assert.deepEqual(snapshot.data.leads,[]);const p=snapshot.data.participants[0];assert.equal((await patch(client,snapshot,{participants:{upsert:[{...p,id:'participant-2'}],remove:[]}})).status,403);assert.equal((await patch(client,snapshot,{participants:{upsert:[{...p,assignedWelcomeIclMemberId:'welcome-2'}],remove:[]}})).status,403);assert.equal((await patch(client,snapshot,{participants:{upsert:[{...p,whatsappGroupJoined:true}],remove:[]}})).status,200);}finally{await env.close();}
});
test('participant can save own answers but cannot read others, change roles, or award attendance',async()=>{
  const env=await environment();try{const {login}=await fixture(env);const {client}=await login('PARTICIPANT','participant-1');const snapshot=(await client.request('/api/state')).body;assert.deepEqual(snapshot.data.participants.map(p=>p.id),['participant-1']);assert.deepEqual(snapshot.data.members,[]);assert.deepEqual(snapshot.data.leads,[]);const p=snapshot.data.participants[0];assert.equal((await patch(client,snapshot,{participants:{upsert:[{...p,whatsappGroupJoined:true}],remove:[]}})).status,403);assert.equal((await patch(client,snapshot,{members:{upsert:[{id:'admin',role:'PAW_HEAD'}],remove:[]}})).status,403);assert.equal((await patch(client,snapshot,{participants:{upsert:[{...p,assessmentAnswers:{1:'5'},firstAssignmentStatus:'In_Progress'}],remove:[]}})).status,200);}finally{await env.close();}
});
test('leaders oversee records but cannot create personal logins or batches',async()=>{
  const env=await environment();try{const {login}=await fixture(env);for(const [role,id]of[['LEADER','leader-1'],['LEADER_HEAD','leaderhead-1']]){const {client}=await login(role,id);const snapshot=(await client.request('/api/state')).body;assert.equal(snapshot.data.participants.length,2);assert.equal((await client.request('/api/accounts','POST',{username:'rogue',role:'PAW_HEAD',password:personal})).status,403);assert.equal((await patch(client,snapshot,{batches:{upsert:[{...snapshot.data.batches[0],name:'Changed'}],remove:[]}})).status,403);}}finally{await env.close();}
});
test('password reset and disable immediately revoke existing sessions',async()=>{
  const env=await environment();try{const {admin,login}=await fixture(env);const {client,account}=await login('WELCOME_MEMBER','welcome-1');assert.equal((await admin.request(`/api/accounts/${account.id}`,'PATCH',{password:temporary})).status,200);assert.equal((await client.request('/api/state')).status,401);assert.equal((await client.request('/api/auth/login','POST',{username:'welcome-1',password:personal})).status,401);assert.equal((await client.request('/api/auth/login','POST',{username:'welcome-1',password:temporary})).body.user.mustChangePassword,true);assert.equal((await admin.request(`/api/accounts/${account.id}`,'PATCH',{active:false})).status,200);assert.equal((await client.request('/api/state')).status,401);assert.equal((await client.request('/api/auth/login','POST',{username:'welcome-1',password:temporary})).status,401);}finally{await env.close();}
});
test('duplicate accounts are rejected, own account cannot be disabled, linked members cannot be deleted',async()=>{
  const env=await environment();try{const {admin,login}=await fixture(env);const {account}=await login('CALLING_MEMBER','caller-1');assert.equal((await admin.request('/api/accounts','POST',{username:'second-login',password:temporary,role:'CALLING_MEMBER',memberId:'caller-1'})).status,409);const accounts=(await admin.request('/api/accounts')).body.accounts;const own=accounts.find(a=>a.role==='PAW_HEAD');assert.equal((await admin.request(`/api/accounts/${own.id}`,'PATCH',{active:false})).status,400);const snapshot=(await admin.request('/api/state')).body;assert.equal((await patch(admin,snapshot,{members:{upsert:[],remove:[account.memberId]}})).status,400);}finally{await env.close();}
});
test('concurrent record edits reject stale revisions instead of overwriting data',async()=>{
  const env=await environment();try{const {admin}=await fixture(env);const snapshot=(await admin.request('/api/state')).body;const lead=snapshot.data.leads[0];assert.equal((await patch(admin,snapshot,{leads:{upsert:[{...lead,callStatus:'INTERESTED'}],remove:[]}})).status,200);assert.equal((await patch(admin,snapshot,{leads:{upsert:[{...lead,callStatus:'NOT_INTERESTED'}],remove:[]}})).status,409);assert.equal((await admin.request('/api/state')).body.data.leads.find(l=>l.id===lead.id).callStatus,'INTERESTED');}finally{await env.close();}
});
test('partial reports and malformed collection records are rejected',async()=>{
  const env=await environment();try{const {admin}=await fixture(env);const snapshot=(await admin.request('/api/state')).body;const p=snapshot.data.participants[0];assert.equal((await patch(admin,snapshot,{participants:{upsert:[{...p,firstAssignmentStatus:'Report_Generated'}],remove:[]}})).status,400);assert.equal((await patch(admin,snapshot,{unknown:{upsert:[],remove:[]}})).status,400);}finally{await env.close();}
});
test('login attempts are throttled',async()=>{
  const env=await environment();try{await owner(env);const client=env.client();for(let i=0;i<8;i++)assert.equal((await client.request('/api/auth/login','POST',{username:'bad-user',password:'wrong'})).status,401);assert.equal((await client.request('/api/auth/login','POST',{username:'bad-user',password:'wrong'})).status,429);}finally{await env.close();}
});
test('database persists accounts with password hashes across server restarts',async()=>{
  const folder=await mkdtemp(join(tmpdir(),'paw-auth-test-'));const dbPath=join(folder,'paw.sqlite');let env=await environment({dbPath});try{await owner(env);await env.close();env=null;const db=new DatabaseSync(dbPath);const row=db.prepare('SELECT password_hash FROM users').get();assert.notEqual(row.password_hash,personal);assert.match(row.password_hash,/^[a-f0-9]{32}:[a-f0-9]{128}$/);db.close();env=await environment({dbPath});const result=await env.client().request('/api/auth/login','POST',{username:'test.owner',password:personal});assert.equal(result.status,200);}finally{if(env)await env.close();await rm(folder,{recursive:true,force:true});}
});
test('production setup requires a private setup key and sessions have Secure cookies',async()=>{
  const env=await environment({production:true,appOrigin:'https://paw.example',setupToken:'test-private-setup-key'});try{const client=env.client();assert.equal((await client.request('/api/auth/setup','POST',{name:'Owner',username:'owner',password:personal},{Origin:'https://paw.example'})).status,403);const result=await client.request('/api/auth/setup','POST',{name:'Owner',username:'owner',password:personal},{Origin:'https://paw.example','X-PAW-Setup-Token':'test-private-setup-key'});assert.equal(result.status,201);assert.match(result.cookie,/Secure/);}finally{await env.close();}
});

test('separate users may save different records concurrently, while stale edits to the same record are blocked',async()=>{
  const env=await environment();try{
    const {admin}=await fixture(env);const snapshot=(await admin.request('/api/state')).body;
    const a=snapshot.data.leads.find(l=>l.id==='lead-1');const b=snapshot.data.leads.find(l=>l.id==='lead-2');
    const first=await patch(admin,snapshot,{leads:{upsert:[{...a,callStatus:'INTERESTED'}],remove:[],before:{[a.id]:a}}});assert.equal(first.status,200);
    const independent=await patch(admin,snapshot,{leads:{upsert:[{...b,callStatus:'NOT_REACHABLE'}],remove:[],before:{[b.id]:b}}});assert.equal(independent.status,200);
    const stale=await patch(admin,snapshot,{leads:{upsert:[{...a,callStatus:'NOT_INTERESTED'}],remove:[],before:{[a.id]:a}}});assert.equal(stale.status,409);
    const final=(await admin.request('/api/state')).body.data.leads;assert.equal(final.find(l=>l.id===a.id).callStatus,'INTERESTED');assert.equal(final.find(l=>l.id===b.id).callStatus,'NOT_REACHABLE');
  }finally{await env.close();}
});
test('expired sessions cannot retrieve workspace records',async()=>{
  const folder=await mkdtemp(join(tmpdir(),'paw-session-test-'));const dbPath=join(folder,'paw.sqlite');const env=await environment({dbPath});try{const admin=await owner(env);const db=new DatabaseSync(dbPath);db.prepare('UPDATE sessions SET expires=?').run(Date.now()-1);db.close();assert.equal((await admin.request('/api/state')).status,401);}finally{await env.close();await rm(folder,{recursive:true,force:true});}
});

test('remote development proxy clients cannot claim local-only first account setup',async()=>{
  const env=await environment();try{const client=env.client();const result=await client.request('/api/auth/setup','POST',{username:'owner',name:'Owner',password:personal},{'X-PAW-Dev-Peer':'192.0.2.55'});assert.equal(result.status,403);assert.equal((await client.request('/api/auth/status')).body.setupRequired,true);}finally{await env.close();}
});

test('question bank is public to read, admin-only to edit and protects concurrent changes',async()=>{
  const env=await environment();try{
    const {admin,login}=await fixture(env);const guest=env.client();const initial=await guest.request('/api/question-bank');assert.equal(initial.status,200);
    const overrides={gu:{1:{Choleric:{word:'સાહસિક',description:'નવા પડકારોનો હિંમતથી સામનો કરે છે.'}}}};
    assert.equal((await guest.request('/api/question-bank','PUT',{revision:0,overrides})).status,401);
    const {client}=await login('PARTICIPANT','participant-1');assert.equal((await client.request('/api/question-bank','PUT',{revision:0,overrides})).status,403);
    const result=await admin.request('/api/question-bank','PUT',{revision:0,overrides});assert.equal(result.status,200);assert.equal(result.body.revision,1);
    assert.equal((await guest.request('/api/question-bank')).body.overrides.gu['1'].Choleric.word,'સાહસિક');
    assert.equal((await admin.request('/api/question-bank','PUT',{revision:0,overrides:{}})).status,409);
    assert.equal((await admin.request('/api/question-bank','PUT',{revision:1,overrides:{bad:{}}})).status,400);
    assert.equal((await admin.request('/api/question-bank','PUT',{revision:1,overrides:{en:{41:{}}}})).status,400);
  }finally{await env.close();}
});
test('ICL leaders cannot read or modify participants outside their own hierarchy',async()=>{
  const env=await environment();try{
    const {admin,login}=await fixture(env);const snapshot=(await admin.request('/api/state')).body;
    const existing=snapshot.data.participants[0];const outside={...existing,id:'outside-participant',loginId:'OUTSIDE-1',phone:'7777777777',assignedWelcomeIclMemberId:'outside-welcome',assignedCallingMemberId:undefined};
    const member={id:'outside-welcome',name:'Outside member',phone:'',email:'',role:'WELCOME_MEMBER',team:'WELCOME_FOLLOWUP',isAvailable:true};
    assert.equal((await patch(admin,snapshot,{members:{upsert:[member],remove:[]},participants:{upsert:[outside],remove:[]}})).status,200);
    const {client}=await login('LEADER','leader-1');const scoped=(await client.request('/api/state')).body;
    assert.equal(scoped.data.participants.length,2);assert.ok(!scoped.data.participants.some(p=>p.id===outside.id));
    assert.equal((await patch(client,scoped,{participants:{upsert:[{...outside,whatsappGroupJoined:true}],remove:[]}})).status,403);
    const source=scoped.data.members.find(m=>m.id==='caller-1');const before=(await admin.request('/api/state')).body;
    assert.equal((await patch(admin,before,{members:{upsert:[{...source,parentLeaderId:'caller-2'}],remove:[]}})).status,400);
  }finally{await env.close();}
});
test('report history is immutable, server-scored, retains retakes, and rejects invalid answers',async()=>{
  const {questions}=await import('../shared/assessment.mjs');const env=await environment();try{
    const {login}=await fixture(env);const {client}=await login('PARTICIPANT','participant-1');let snapshot=(await client.request('/api/state')).body;const p=snapshot.data.participants[0];
    const answers=Object.fromEntries(questions.map(q=>[q.questionNumber,q.options.find(o=>o.temperament==='Phlegmatic').value]));
    const report={id:'report-first',completedAt:'2000-01-01',language:'gu',answers,scores:{},dominant:'Choleric',secondary:'Sanguine'};
    let saved=await patch(client,snapshot,{participants:{upsert:[{...p,assessmentAnswers:answers,firstAssignmentStatus:'Report_Generated',assessmentReports:[report]}],remove:[]}});
    assert.equal(saved.status,200,saved.body.error);let current=saved.body.data.participants[0];assert.equal(current.assessmentReports[0].dominant,'Phlegmatic');assert.equal(current.assessmentReports[0].scores.Phlegmatic.total,40);assert.notEqual(current.assessmentReports[0].completedAt,report.completedAt);
    snapshot=saved.body;assert.equal((await patch(client,snapshot,{participants:{upsert:[{...current,assessmentReports:[]}],remove:[]}})).status,400);
    assert.equal((await patch(client,snapshot,{participants:{upsert:[{...current,assessmentAnswers:{1:'invalid'},firstAssignmentStatus:'In_Progress'}],remove:[]}})).status,400);
    const second={...report,id:'report-second',language:'hi'};
    saved=await patch(client,snapshot,{participants:{upsert:[{...current,assessmentReports:[second,...current.assessmentReports]}],remove:[]}});assert.equal(saved.status,200,saved.body.error);assert.equal(saved.body.data.participants[0].assessmentReports.length,2);
  }finally{await env.close();}
});
