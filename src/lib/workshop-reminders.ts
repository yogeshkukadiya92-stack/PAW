import { maintenanceSchedule } from '../../shared/workshop-maintenance.mjs';
import type { Participant, PAWBatch } from '@/types/paw';
import { completionReadiness } from '../../shared/workshop-completion.mjs';
import { interventionState } from './workshop-activity';

export type Reminder = {id:string;participantId:string;name:string;batchId:string;workshop:string;title:string;detail:string;severity:'Overdue'|'Action required'|'Upcoming';section:'assignments'|'sessions'|'completion'|'progress'|'maintenance'};
export function workshopReminders(participants:Participant[],batches:PAWBatch[],manager:boolean,personal:boolean,now=Date.now()):Reminder[] {
  const todayDate=new Date(now), today=`${todayDate.getFullYear()}-${String(todayDate.getMonth()+1).padStart(2,'0')}-${String(todayDate.getDate()).padStart(2,'0')}`;
  const soonDate=new Date(now);soonDate.setDate(soonDate.getDate()+2);
  const soon=`${soonDate.getFullYear()}-${String(soonDate.getMonth()+1).padStart(2,'0')}-${String(soonDate.getDate()).padStart(2,'0')}`;
  const result:Reminder[]=[];
  for(const p of participants){
    const batch=batches.find(b=>b.id===p.pawBatchId);if(!batch)continue;
    const add=(id:string,title:string,detail:string,severity:Reminder['severity'],section:Reminder['section'])=>result.push({id:`${p.id}-${id}`,participantId:p.id,name:p.fullName,batchId:p.pawBatchId,workshop:batch.name,title,detail,severity,section});
    for(const task of p.assignments||[]){
      const last=task.history.slice(-1)[0];
      if(last?.action==='Approved')continue;
      if(last?.action==='Submitted'){if(manager)add(task.id,'Submission awaiting review',task.title,'Action required','assignments');continue;}
      if(task.dueDate<today)add(task.id,'Assignment overdue',`${task.title} · Due ${task.dueDate}`,'Overdue','assignments');
      else if(last?.action==='Changes_Requested')add(task.id,'Assignment corrections requested',`${task.title} · ${last.note}`,'Action required','assignments');
      else if(task.dueDate<=soon)add(task.id,'Assignment due soon',`${task.title} · Due ${task.dueDate}`,'Upcoming','assignments');
    }
    for(const s of batch.sessions||[]){
      const starts=Date.parse(s.startsAt),a=p.sessionAttendance?.find(a=>a.sessionId===s.id);
      if(starts>=now&&starts<=now+7*86400000)add(s.id,'Upcoming session',`${s.title} · ${new Date(starts).toLocaleString('en-IN')}`,'Upcoming','sessions');
      else if(!personal&&!a&&starts<now-2*3600000)add(s.id,'Session attendance not recorded',s.title,'Action required','sessions');
    }
    if(!personal){const followup=interventionState(p,today);if(followup.overdue||followup.dueToday)add('followup','Follow-up due',`${followup.due} · ${followup.last?.note||''}`,followup.overdue?'Overdue':'Action required','progress');}
    for(const m of maintenanceSchedule(p,batch,today)){
      if(!m.done&&(m.status!=='Upcoming'||m.due<=soon||m.last?.outcome==='Support_Required'))add(`maintenance-${m.day}`,`Day ${m.day} ${m.last?.outcome==='Support_Required'?'follow-up needs support':'post-workshop follow-up'}`,`${m.last?.outcome.replace(/_/g,' ')||'Follow-up pending'} · Due ${m.due}`,m.status==='Overdue'?'Overdue':m.status==='Due today'||m.last?.outcome==='Support_Required'?'Action required':'Upcoming','maintenance');
    }
    const readiness=completionReadiness(p,batch,now);
    if(manager&&readiness.status==='Ready for review')add('completion','Ready for completion review','All tracked workshop requirements are met.','Action required','completion');
    if(readiness.status==='Needs review')add('completion','Completion requirements changed','New or updated workshop records need attention.','Action required','completion');
  }
  const rank={'Overdue':0,'Action required':1,'Upcoming':2};
  return result.sort((a,b)=>rank[a.severity]-rank[b.severity]||a.name.localeCompare(b.name)||a.title.localeCompare(b.title));
}
