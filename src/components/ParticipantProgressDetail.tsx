import { useState } from 'react';
import type { Participant, ICLMember, PAWBatch, InterventionEvent } from '@/types/paw';
import type { LoginUser } from '@/lib/api';
import { participantProgress, displayDate } from '@/lib/workshop-progress';
import { participantTimeline } from '@/lib/workshop-activity';
import { useDialog } from '@/lib/use-dialog';

type Props = {participant:Participant;members:ICLMember[];batch?:PAWBatch;user:LoginUser;onClose:()=>void;onUpdate:(id:string,update:(p:Participant)=>Participant)=>void;onNavigate:(batchId:string,section:'assignments'|'sessions'|'completion'|'maintenance')=>void};
export function ParticipantProgressDetail({participant:p,members,batch,user,onClose,onUpdate,onNavigate}:Props) {
  const ref=useDialog(onClose),r=participantProgress(p,members,batch);
  const [note,setNote]=useState(''),[date,setDate]=useState(r.intervention.due),[historyLimit,setHistoryLimit]=useState(20);
  const allowed=['PAW_HEAD','LEADER_HEAD','LEADER','WELCOME_MEMBER'].includes(user.role);
  const timeline=participantTimeline(p,batch);
  const append=(action:InterventionEvent['action'],nextFollowupDate:string)=>{
    const event:InterventionEvent={id:crypto.randomUUID(),action,note:note.trim(),nextFollowupDate,at:new Date().toISOString(),by:user.name};
    onUpdate(p.id,current=>({...current,interventionEvents:[...(current.interventionEvents||[]),event]}));setNote('');
  };
  return <div className="workshop-detail-backdrop"><div ref={ref} className="profile-app workshop-detail" role="dialog" aria-modal="true" aria-labelledby="progress-detail-title" tabIndex={-1}>
    <button className="profile-button" onClick={onClose}>Close</button><h2 id="progress-detail-title">{p.fullName}</h2><p className="profile-muted">{p.loginId} · {batch?.name||'Unknown workshop'}</p>
    <dl className="workshop-detail-grid"><div><dt>ICL member</dt><dd>{r.owner?.name||'Unassigned'}</dd></div><div><dt>Leader</dt><dd>{r.leader?.name||'Not assigned'}</dd></div><div><dt>40-Q assessment</dt><dd>{p.firstAssignmentStatus.replace(/_/g,' ')}</dd></div><div><dt>Workshop tasks</dt><dd>{r.approved}/{r.assignmentTotal} approved · {r.awaitingReview} awaiting review</dd></div><div><dt>Attendance</dt><dd>{r.attended}/{r.sessionTotal} present · {r.recorded} recorded</dd></div><div><dt>Welcome call</dt><dd>{p.welcomeCallStatus.replace(/_/g,' ')}</dd></div></dl>
    <div className="profile-filters"><button className="profile-button" onClick={()=>{onClose();onNavigate(p.pawBatchId,'assignments');}}>Open assignments</button><button className="profile-button" onClick={()=>{onClose();onNavigate(p.pawBatchId,'sessions');}}>Open sessions</button></div>
    <h3>Post-workshop follow-ups</h3>{r.maintenance.map(m=><p className="workshop-note" key={m.day}>Day {m.day} · {m.status} · {displayDate(m.due)}</p>)}<button className="profile-button" onClick={()=>{onClose();onNavigate(p.pawBatchId,'maintenance');}}>Open 30 / 60 / 90-day follow-ups</button><h3>Completion</h3><p className="profile-muted">{r.completion.status}</p><button className="profile-button" onClick={()=>{onClose();onNavigate(p.pawBatchId,'completion');}}>Open completion review</button><h3>Follow-up management</h3><p className="profile-muted">{r.intervention.open?'Open':r.intervention.last?'Resolved':'No follow-up opened'}{r.intervention.due?` · Next: ${displayDate(r.intervention.due)}`:''}</p>
    <p className="workshop-note">Closing a follow-up keeps its history. Assignment and attendance flags remain until their records are updated.</p>
    {allowed&&<form className="workshop-form" onSubmit={e=>{e.preventDefault();const next=String(new FormData(e.currentTarget).get('nextFollowupDate')||'');append(r.intervention.open?'Note':'Opened',next);}}>
      <label>Follow-up note<textarea required maxLength={4000} value={note} onChange={e=>setNote(e.target.value)} placeholder="What happened, and what needs to happen next?"/></label>
      <label>Next follow-up date (optional)<input name="nextFollowupDate" type="date" value={date} onChange={e=>setDate(e.target.value)}/></label>
      <div className="profile-filters"><button className="profile-button primary" disabled={!note.trim()}>{r.intervention.open?'Save note & next date':'Open follow-up'}</button>{r.intervention.open&&<button type="button" className="profile-button" disabled={!note.trim()} onClick={()=>{append('Resolved','');setDate('');}}>Resolve with this note</button>}</div>
    </form>}
    <h3>Workshop assignments</h3>{(p.assignments||[]).map(t=><article className="workshop-log" key={t.id}><strong>{t.title}</strong><p>{(t.history.slice(-1)[0]?.action||'Pending').replace(/_/g,' ')} · Due {displayDate(t.dueDate)}</p></article>)}{!p.assignments?.length&&<p className="profile-muted">No workshop tasks assigned.</p>}
    <h3>Session attendance</h3>{batch?.sessions?.length?batch.sessions.map(s=><p className="workshop-log" key={s.id}>{s.title} · {p.sessionAttendance?.find(a=>a.sessionId===s.id)?.status||'Not recorded'}</p>):r.sessions.map((s,i)=><p className="workshop-log" key={i}>Legacy Day {i+1} · {!s?'Not recorded':s.attended?'Present':'Absent'}</p>)}
    <h3>Activity timeline</h3><p className="workshop-note">Submissions, reviews, follow-ups and the latest attendance entries. Earlier attendance edits and login activity are not tracked.</p>
    {timeline.slice(0,historyLimit).map(e=><article className="workshop-log" key={e.id}><strong>{e.title}</strong><p className="profile-muted">{displayDate(e.at)}{e.at.includes('T')?` · ${new Date(e.at).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}`:''}{e.by?` · ${e.by}`:''}</p><p>{e.note}</p>{e.link&&/^https?:\/\//i.test(e.link)&&<a className="profile-text-button" href={e.link} target="_blank" rel="noopener noreferrer">Open submitted document ↗</a>}</article>)}
    {timeline.length>historyLimit&&<button className="profile-button" onClick={()=>setHistoryLimit(n=>n+20)}>Show earlier activity</button>}
  </div></div>;
}
