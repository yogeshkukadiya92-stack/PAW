import { useState } from 'react';
import type { Participant, PAWBatch, CompletionEvent } from '@/types/paw';
import { type LoginUser, canManage } from '@/lib/api';
import { completionReadiness } from '../../shared/workshop-completion.mjs';
import { displayDate } from '@/lib/workshop-progress';
import { downloadCSV } from '@/lib/export-utils';

type Props={participants:Participant[];batches:PAWBatch[];user:LoginUser;onUpdate:(id:string,update:(p:Participant)=>Participant)=>void};
export function WorkshopCompletion({participants,batches,user,onUpdate}:Props) {
  const [filter,setFilter]=useState('All'),[search,setSearch]=useState('');
  const rows=participants.map(p=>({p,r:completionReadiness(p,batches.find(b=>b.id===p.pawBatchId))}));
  const shown=rows.filter(({p,r})=>(filter==='All'||r.status===filter)&&`${p.fullName} ${p.loginId}`.toLowerCase().includes(search.toLowerCase()));
  if(user.role==='PARTICIPANT') return <section className="profile-panel"><h2>My workshop completion</h2><p className="profile-muted">Your leader reviews your report, approved assignments and session attendance before confirming workshop completion.</p>{rows.map(({p,r})=><CompletionCard key={p.id} p={p} readiness={r} user={user} onUpdate={onUpdate}/>)}</section>;
  return <section className="profile-panel"><h2>Workshop completion</h2><p className="profile-muted">Track requirements and leader sign-off for each participant.</p>
    <p className="workshop-note">Ready for review requires a generated personality report, all assigned tasks approved, Present / Late attendance for every session (legacy Day 1–3 when no sessions are scheduled), no upcoming sessions, and no open follow-up or escalation. Excused attendance remains a blocker. Certificate access continues to use the existing personality-report rule.</p>
    <div className="profile-dashboard-stats">{['Ready for review','Completed','Needs review','In progress'].map(s=><div key={s}><strong>{rows.filter(row=>row.r.status===s).length}</strong><span>{s}</span></div>)}</div>
    <div className="profile-filters"><label>Search participant<input type="search" value={search} onChange={e=>setSearch(e.target.value)}/></label><label>Completion status<select value={filter} onChange={e=>setFilter(e.target.value)}>{['All','Ready for review','Completed','Needs review','In progress'].map(s=><option key={s}>{s}</option>)}</select></label><button className="profile-button" disabled={!shown.length} onClick={()=>downloadCSV([['Participant ID','Name','Workshop','Completion','Blockers','Last decision','By','Date','Note'],...shown.map(({p,r})=>{const last=p.completionEvents?.slice(-1)[0];return [p.loginId,p.fullName,batches.find(b=>b.id===p.pawBatchId)?.name||'',r.status,r.blockers.join('; '),last?.action||'',last?.by||'',last?.at||'',last?.note||''];})],'PAW_Completion.csv')}>Export completion CSV ({shown.length})</button></div>
    {!shown.length&&<p className="profile-empty">No participants match this view.</p>}
    {shown.map(({p,r})=><CompletionCard key={p.id} p={p} readiness={r} user={user} onUpdate={onUpdate}/>)}
  </section>;
}
function CompletionCard({p,readiness:r,user,onUpdate}:{p:Participant;readiness:ReturnType<typeof completionReadiness>;user:LoginUser;onUpdate:Props['onUpdate']}) {
  const [note,setNote]=useState('');const completed=p.completionEvents?.slice(-1)[0]?.action==='Completed';
  const act=(action:CompletionEvent['action'])=>{const event:CompletionEvent={id:crypto.randomUUID(),action,note:note.trim(),at:new Date().toISOString(),by:user.name};onUpdate(p.id,current=>({...current,completionEvents:[...(current.completionEvents||[]),event]}));setNote('');};
  return <article className="workshop-assignment-card"><div className="profile-question-heading"><h3>{p.fullName} · {p.loginId}</h3><span className={r.status==='Completed'?'profile-done':'profile-pending'}>{r.status}</span></div><p className="workshop-note">{r.approved}/{r.taskTotal} tasks approved · {r.present}/{r.sessionTotal} sessions present</p>{r.blockers.length>0&&<ul className="workshop-blockers">{r.blockers.map(reason=><li key={reason}>{reason}</li>)}</ul>}
    {canManage(user)&&(r.ready&&!completed||completed)&&<form className="workshop-form" onSubmit={e=>{e.preventDefault();act(completed?'Reopened':'Completed');}}><label>{completed?'Reason for reopening':'Completion review note'}<textarea required maxLength={4000} value={note} onChange={e=>setNote(e.target.value)}/></label><button className="profile-button primary" disabled={!note.trim()}>{completed?'Reopen participant':'Mark workshop completed'}</button></form>}
    {!!p.completionEvents?.length&&<details><summary>Completion decision history</summary>{p.completionEvents.map(e=><div key={e.id} className="workshop-log"><strong>{e.action} · {e.by} · {displayDate(e.at)}</strong><p>{e.note}</p></div>)}</details>}
  </article>;
}
