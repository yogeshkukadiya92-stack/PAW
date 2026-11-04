import type { Participant, ICLMember, PAWBatch } from '@/types/paw';
import { participantProgress } from './workshop-progress';
import { participantTimeline } from './workshop-activity';
export function workshopReportRows(kind: string, participants: Participant[], members: ICLMember[], batches: PAWBatch[]) {
  if(kind==='Assignments') return [['Workshop','Participant ID','Name','Assignment','Due date','Status','Submitted at','Latest review','Reviewer'],...participants.flatMap(p=>(p.assignments||[]).map(t=>{
    const last=t.history.slice(-1)[0],submitted=t.history.filter(e=>e.action==='Submitted').slice(-1)[0];
    return [batches.find(b=>b.id===p.pawBatchId)?.name||'',p.loginId,p.fullName,t.title,t.dueDate,last?.action||'Pending',submitted?.at||'',last?.action!=='Submitted'?last?.note||'':'',last?.action!=='Submitted'?last?.by||'':''];
  }))];
  if(kind==='Attendance') return [['Workshop','Participant ID','Name','Session','Session date','Attendance','Note','Recorded by','Recorded at'],...participants.flatMap(p=>{
    const batch=batches.find(b=>b.id===p.pawBatchId),prefix=[batch?.name||'',p.loginId,p.fullName];
    if(batch?.sessions?.length) return batch.sessions.map(s=>{const a=p.sessionAttendance?.find(a=>a.sessionId===s.id);return [...prefix,s.title,s.startsAt,a?.status||'Not recorded',a?.note||'',a?.updatedBy||'',a?.updatedAt||''];});
    return [1,2,3].map(day=>{const f=p.followups.filter(f=>f.sessionNumber===day).sort((a,b)=>b.date.localeCompare(a.date))[0];return [...prefix,`Legacy Day ${day}`,'',!f?'Not recorded':f.attended?'Present':'Absent',f?.iclRemark||'','',f?.date||''];});
  })];
  if(kind==='Activity') return [['Workshop','Participant ID','Name','Date','Activity','Note','Recorded by'],...participants.flatMap(p=>participantTimeline(p,batches.find(b=>b.id===p.pawBatchId)).map(e=>[batches.find(b=>b.id===p.pawBatchId)?.name||'',p.loginId,p.fullName,e.at,e.title,e.note,e.by]))];
  return [['Workshop','Participant ID','Name','ICL member','Leader','40-Q status','Approved tasks','Total tasks','Awaiting review','Present','Recorded attendance','Total sessions','Overall','Flags','Follow-up status','Next follow-up','Completion','Post-workshop follow-ups due'],...participants.map(p=>{
    const b=batches.find(b=>b.id===p.pawBatchId),r=participantProgress(p,members,b);
    return [b?.name||'',p.loginId,p.fullName,r.owner?.name||'Unassigned',r.leader?.name||'Unassigned',p.firstAssignmentStatus,r.approved,r.assignmentTotal,r.awaitingReview,r.attended,r.recorded,r.sessionTotal,r.status,r.reasons.join('; '),r.intervention.open?'Open':r.intervention.last?'Resolved':'None',r.intervention.due,r.completion.status,r.maintenance.filter(m=>m.status==='Overdue'||m.status==='Due today').length];
  })];
}
