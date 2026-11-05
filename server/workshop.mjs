import { completionReadiness } from '../shared/workshop-completion.mjs';
const fail = (status,message) => {throw Object.assign(new Error(message),{status});};
const same = (a,b) => JSON.stringify(a)===JSON.stringify(b);
const text = (value,max=4000) => typeof value==='string' && value.length<=max;
const id = value => typeof value==='string' && /^[A-Za-z0-9_.:-]{1,100}$/.test(value);
const url = value => {if(value==='')return true;try{return ['https:','http:'].includes(new URL(value).protocol);}catch{return false;}};
const list = (value,label) => {if(!Array.isArray(value)||value.length>500)fail(400,`Invalid ${label}.`);};
export function authorizeWorkshop(old,next,user) {
  const manager=['PAW_HEAD','LEADER_HEAD','LEADER'].includes(user.role);
  const before=old?.assignments||[], after=next.assignments||[];
  list(after,'assignments');
  if(after.some(t=>!t||typeof t!=='object'))fail(400,'Invalid assignment.');
  if(same(before,after))return;
  if(before.some(task=>!after.some(t=>t.id===task.id)))fail(403,'Assignment history cannot be deleted.');
  for(const task of after){
    const previous=before.find(t=>t.id===task.id);
    if(!previous){if(!manager||task.history?.length)fail(403,'Only leaders can assign new work.');continue;}
    if(!same({...previous,history:[]},{...task,history:[]}))fail(403,'Assigned instructions cannot be rewritten. Create a new assignment instead.');
    if(!Array.isArray(task.history)||task.history.length<previous.history.length||!same(previous.history,task.history.slice(0,previous.history.length)))fail(403,'Submission and review history cannot be rewritten.');
    const added=task.history.slice(previous.history.length);
    if(added.length>1)fail(400,'Submit one assignment action at a time.');
    if(!added.length)continue;
    const event=added[0],last=previous.history.at(-1);
    if(user.role==='PARTICIPANT'||manager&&event.action==='Submitted'){
      if(event.action!=='Submitted'||last&&last.action!=='Changes_Requested')fail(403,'Submit pending work or requested corrections only.');
      if(event.note)fail(403,'Participants cannot add reviewer notes.');
    }else if(manager){
      if(!['Approved','Changes_Requested'].includes(event.action)||last?.action!=='Submitted')fail(403,'Review submitted work only.');
      if(event.answer||event.link)fail(400,'Review notes cannot replace the submitted answer.');
    }else fail(403,'Only the participant can submit work and leaders can review it.');
    event.at=new Date().toISOString();event.by=user.name;
  }
}
export function validateWorkshop(state) {
  for(const b of state.batches){
    list(b.sessions||[],'sessions');const ids=new Set();
    for(const s of b.sessions||[]){if(!s||!id(s.id)||ids.has(s.id)||!text(s.title,200)||!s.title.trim()||!text(s.startsAt,40)||!Number.isFinite(Date.parse(s.startsAt))||!url(s.link))fail(400,'Invalid workshop session.');ids.add(s.id);}
  }
  for(const p of state.participants){
    validateInterventions(p);
    validateCompletion(p);
    validateMaintenance(p);
    list(p.assignments||[],'assignments');const ids=new Set();
    for(const t of p.assignments||[]){
      if(!t||!id(t.id)||ids.has(t.id)||!text(t.title,200)||!t.title.trim()||!text(t.instructions)||!/^\d{4}-\d{2}-\d{2}$/.test(t.dueDate)||!Number.isFinite(Date.parse(t.dueDate)))fail(400,'Invalid assignment.');ids.add(t.id);list(t.history,'assignment history');const events=new Set();let last;
      for(const e of t.history){if(!e||!id(e.id)||events.has(e.id)||!['Submitted','Approved','Changes_Requested'].includes(e.action)||!text(e.answer,10000)||!url(e.link)||!text(e.note)||!text(e.by,200)||!Number.isFinite(Date.parse(e.at)))fail(400,'Invalid submission or review.');events.add(e.id);
        if(e.action==='Submitted'){if(last&&last!=='Changes_Requested'||(!e.answer.trim()&&!e.link))fail(400,'Write an answer or add a submission link.');}
        else if(last!=='Submitted'||e.action==='Changes_Requested'&&!e.note.trim())fail(400,'A review needs a submission; corrections need a note.');last=e.action;
      }
    }
    list(p.sessionAttendance||[],'attendance');const sessions=new Set((state.batches.find(b=>b.id===p.pawBatchId)?.sessions||[]).map(s=>s.id)),seen=new Set();
    for(const a of p.sessionAttendance||[]){if(!a||!sessions.has(a.sessionId)||seen.has(a.sessionId)||!['Present','Absent','Late','Excused'].includes(a.status)||!text(a.note)||!text(a.updatedBy,200)||!Number.isFinite(Date.parse(a.updatedAt)))fail(400,'Invalid session attendance.');seen.add(a.sessionId);}
  }
}
export function stampAttendance(old,next,user){
  list(next.sessionAttendance||[],'attendance');
  for(const a of next.sessionAttendance||[]){if(!a||typeof a!=='object')fail(400,'Invalid attendance.');if(!same(a,(old?.sessionAttendance||[]).find(s=>s.sessionId===a.sessionId))){a.updatedAt=new Date().toISOString();a.updatedBy=user.name;}}
}

export function authorizeIntervention(old,next,user) {
  const before=old?.interventionEvents||[],after=next.interventionEvents||[];
  list(after,'follow-up history');
  if(same(before,after))return;
  if(!['PAW_HEAD','LEADER_HEAD','LEADER','WELCOME_MEMBER'].includes(user.role))fail(403,'Only assigned staff can manage follow-ups.');
  if(after.length!==before.length+1||!same(before,after.slice(0,before.length)))fail(403,'Follow-up history cannot be rewritten or removed.');
  const event=after.at(-1);
  if(!event||typeof event!=='object')fail(400,'Invalid follow-up event.');
  event.at=new Date().toISOString();event.by=user.name;
}
function validateInterventions(p) {
  list(p.interventionEvents||[],'follow-up history');const ids=new Set();let open=false;
  for(const e of p.interventionEvents||[]){
    if(!e||!id(e.id)||ids.has(e.id)||!['Opened','Note','Resolved'].includes(e.action)||!text(e.note)||!e.note.trim()||!text(e.by,200)||!Number.isFinite(Date.parse(e.at))||typeof e.nextFollowupDate!=='string'||e.nextFollowupDate!==''&&(!/^\d{4}-\d{2}-\d{2}$/.test(e.nextFollowupDate)||!Number.isFinite(Date.parse(e.nextFollowupDate))))fail(400,'Invalid follow-up details.');
    if(e.action==='Opened'){if(open)fail(400,'This follow-up is already open.');open=true;}
    else{if(!open)fail(400,'Open a follow-up before adding a note or resolving it.');if(e.action==='Resolved'){if(e.nextFollowupDate)fail(400,'Resolved follow-ups cannot have a pending date.');open=false;}}
    ids.add(e.id);
  }
}

export function authorizeCompletion(old,next,user) {
  const before=old?.completionEvents||[],after=next.completionEvents||[];
  list(after,'completion history');if(same(before,after))return;
  if(!['PAW_HEAD','LEADER_HEAD','LEADER'].includes(user.role))fail(403,'Only a leader can complete or reopen a workshop participant.');
  if(after.length!==before.length+1||!same(before,after.slice(0,before.length)))fail(403,'Completion history cannot be rewritten or removed.');
  const e=after.at(-1);if(!e||typeof e!=='object')fail(400,'Invalid completion event.');
  e.at=new Date().toISOString();e.by=user.name;
}
function validateCompletion(p) {
  list(p.completionEvents||[],'completion history');const ids=new Set();let completed=false;
  for(const e of p.completionEvents||[]){
    if(!e||!id(e.id)||ids.has(e.id)||!['Completed','Reopened'].includes(e.action)||!text(e.note)||!e.note.trim()||!text(e.by,200)||!Number.isFinite(Date.parse(e.at)))fail(400,'Invalid completion event.');
    if(e.action==='Completed'){if(completed)fail(400,'Reopen this participant before completing again.');completed=true;}
    else{if(!completed)fail(400,'Only completed participants can be reopened.');completed=false;}ids.add(e.id);
  }
}
export function validateCompletionChanges(next,previous) {
  for(const p of next.participants){
    const old=previous.participants.find(old=>old.id===p.id);
    if((p.completionEvents||[]).length>(old?.completionEvents||[]).length&&p.completionEvents.at(-1)?.action==='Completed'){
      const r=completionReadiness(p,next.batches.find(b=>b.id===p.pawBatchId));
      if(!r.ready)fail(400,`Completion is blocked: ${r.blockers.join('; ')}.`);
    }
  }
}

export function authorizeMaintenance(old,next,user) {
  const before=old?.maintenanceEvents||[],after=next.maintenanceEvents||[];
  list(after,'post-workshop follow-up history');if(same(before,after))return;
  if(!['PAW_HEAD','LEADER_HEAD','LEADER','WELCOME_MEMBER'].includes(user.role))fail(403,'Only assigned staff can record post-workshop follow-ups.');
  if(after.length!==before.length+1||!same(before,after.slice(0,before.length)))fail(403,'Post-workshop follow-up history cannot be rewritten or removed.');
  const e=after.at(-1);if(!e||typeof e!=='object')fail(400,'Invalid post-workshop follow-up.');
  e.at=new Date().toISOString();e.by=user.name;
}
function validateMaintenance(p) {
  list(p.maintenanceEvents||[],'post-workshop follow-up history');const ids=new Set();
  for(const e of p.maintenanceEvents||[]){
    if(!e||!id(e.id)||ids.has(e.id)||![30,60,90].includes(e.day)||!['Completed','Unreachable','Support_Required','Rescheduled'].includes(e.outcome)||!text(e.note)||!e.note.trim()||!text(e.by,200)||!Number.isFinite(Date.parse(e.at))||typeof e.nextFollowupDate!=='string')fail(400,'Invalid post-workshop follow-up.');
    if(e.outcome==='Completed'){if(e.nextFollowupDate)fail(400,'Completed follow-ups cannot have a retry date.');}
    else if(!/^\d{4}-\d{2}-\d{2}$/.test(e.nextFollowupDate)||!Number.isFinite(Date.parse(e.nextFollowupDate))||new Date(e.nextFollowupDate+'T00:00:00Z').toISOString().slice(0,10)!==e.nextFollowupDate)fail(400,'Choose a valid next follow-up date.');
    ids.add(e.id);
  }
}

export function validateMaintenanceChanges(next,previous) {
  const today=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Kolkata'});
  for(const p of next.participants){
    const old=previous.participants.find(old=>old.id===p.id);
    if((p.maintenanceEvents||[]).length>(old?.maintenanceEvents||[]).length){
      const batch=next.batches.find(b=>b.id===p.pawBatchId);
      if(!batch||batch.endDate>today)fail(400,'Post-workshop follow-up updates open on the workshop end date.');
    }
  }
}
