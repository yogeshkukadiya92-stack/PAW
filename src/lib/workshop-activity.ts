import type { Participant, PAWBatch } from '@/types/paw';

export function interventionState(p: Participant, today = localDate()) {
  const last = p.interventionEvents?.slice(-1)[0];
  const open = !!last && last.action !== 'Resolved';
  const due = open ? last.nextFollowupDate : '';
  return {open, due, last, overdue: !!due && due < today, dueToday: due === today};
}
export function localDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
export function participantTimeline(p: Participant, batch?: PAWBatch) {
  const events: {id:string;at:string;title:string;note:string;by:string;link?:string}[] = [];
  if(p.registeredAt) events.push({id:'registration',at:p.registeredAt,title:'Registered for workshop',note:batch?.name||'',by:''});
  for(const t of p.assignments||[]) for(const e of t.history) events.push({id:`task-${t.id}-${e.id}`,at:e.at,title:`${t.title} · ${e.action.replace(/_/g,' ')}`,note:[e.answer,e.note].filter(Boolean).join('\n'),by:e.by,link:e.link});
  for(const a of p.sessionAttendance||[]) events.push({id:`attendance-${a.sessionId}`,at:a.updatedAt,title:`${batch?.sessions?.find(s=>s.id===a.sessionId)?.title||'Session'} · ${a.status}`,note:a.note,by:a.updatedBy});
  for(const f of p.followups) events.push({id:`legacy-${f.id}`,at:f.date,title:f.sessionNumber?`Session ${f.sessionNumber} follow-up`:'Welcome / general follow-up',note:[f.iclRemark,f.supportRequired!=='None'?`Support: ${f.supportRequired}`:'',f.escalatedToLeader?'Escalated to leader':''].filter(Boolean).join('\n'),by:''});
  for(const e of p.interventionEvents||[]) events.push({id:`intervention-${e.id}`,at:e.at,title:`Follow-up ${e.action.toLowerCase()}`,note:[e.note,e.nextFollowupDate?`Next follow-up: ${e.nextFollowupDate}`:''].filter(Boolean).join('\n'),by:e.by});
  for(const e of p.completionEvents||[]) events.push({id:`completion-${e.id}`,at:e.at,title:`Workshop ${e.action.toLowerCase()}`,note:e.note,by:e.by});
  for(const e of p.maintenanceEvents||[]) events.push({id:`maintenance-${e.id}`,at:e.at,title:`Day ${e.day} follow-up · ${e.outcome.replace(/_/g,' ')}`,note:[e.note,e.nextFollowupDate?`Next follow-up: ${e.nextFollowupDate}`:''].filter(Boolean).join('\n'),by:e.by});
  return events.sort((a,b)=>Date.parse(b.at)-Date.parse(a.at));
}
