import { useEffect, useState } from 'react';
import type { Participant, PAWBatch } from '@/types/paw';
import { type LoginUser, canManage } from '@/lib/api';
import { workshopReminders, type Reminder } from '@/lib/workshop-reminders';

export function WorkshopReminders({participants,batches,user,onOpen}:{participants:Participant[];batches:PAWBatch[];user:LoginUser;onOpen:(reminder:Reminder)=>void}) {
  const [now,setNow]=useState(Date.now()),[filter,setFilter]=useState('All'),[limit,setLimit]=useState(8);
  useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),60000);return()=>clearInterval(timer);},[]);
  const reminders=workshopReminders(participants,batches,canManage(user),user.role==='PARTICIPANT',now);
  const shown=reminders.filter(r=>filter==='All'||r.severity===filter);
  return <section className="profile-panel workshop-reminders" aria-label="Workshop reminders"><div className="profile-question-heading"><div><h2>{user.role==='PARTICIPANT'?'My reminders':'Workshop reminders'} ({reminders.length})</h2><p className="profile-muted">Due work and upcoming sessions across your accessible workshops.</p></div><label>Reminder type<select value={filter} onChange={e=>{setFilter(e.target.value);setLimit(8);}}>{['All','Overdue','Action required','Upcoming'].map(v=><option key={v}>{v}</option>)}</select></label></div>
    {!shown.length&&<p className="workshop-note">No reminders match this view.</p>}
    {shown.slice(0,limit).map(r=><div className="workshop-reminder" key={r.id}><div><span className="profile-pending">{r.severity}</span><strong>{r.title}</strong><p>{r.name} · {r.workshop}</p><small>{r.detail}</small></div><button className="profile-button" onClick={()=>onOpen(r)}>View details</button></div>)}
    {shown.length>limit&&<button className="profile-button" onClick={()=>setLimit(n=>n+8)}>Show more ({shown.length-limit})</button>}
  </section>;
}
