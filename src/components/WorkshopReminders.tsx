import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Participant, PAWBatch } from '@/types/paw';
import { type LoginUser, canManage } from '@/lib/api';
import { workshopReminders, type Reminder } from '@/lib/workshop-reminders';

export function WorkshopReminders({participants,batches,user,onOpen}:{participants:Participant[];batches:PAWBatch[];user:LoginUser;onOpen:(reminder:Reminder)=>void}) {
  const [now,setNow]=useState(Date.now()),[filter,setFilter]=useState('All'),[limit,setLimit]=useState(8);
  useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),60000);return()=>clearInterval(timer);},[]);
  const reminders=workshopReminders(participants,batches,canManage(user),user.role==='PARTICIPANT',now);
  const shown=reminders.filter(r=>filter==='All'||r.severity===filter);
  const title=user.role==='PARTICIPANT'?'My reminders':'Workshop reminders';
  return <details className="profile-panel workshop-reminders">
    <summary>{title} ({reminders.length}) <ChevronDown size={16} aria-hidden="true"/></summary>
    <div className="workshop-reminder-content">
    <div className="profile-question-heading"><p className="profile-muted">Due work and upcoming sessions across your accessible workshops.</p><label>Reminder type<select value={filter} onChange={e=>{setFilter(e.target.value);setLimit(8);}}>{['All','Overdue','Action required','Upcoming'].map(v=><option key={v}>{v}</option>)}</select></label></div>
    {!shown.length&&<p className="workshop-note">No reminders match this view.</p>}
    {shown.slice(0,limit).map(r=><div className="workshop-reminder" key={r.id}><div><span className="profile-pending">{r.severity}</span><strong>{r.title}</strong><p>{r.name} · {r.workshop}</p><small>{r.detail}</small></div><button className="profile-button" onClick={event=>{const details=event.currentTarget.closest('details');if(details){details.open=false;details.querySelector('summary')?.focus({preventScroll:true});}onOpen(r);}}>View details</button></div>)}
    {shown.length>limit&&<button className="profile-button" onClick={()=>setLimit(n=>n+8)}>Show more ({shown.length-limit})</button>}
    </div>
  </details>;
}
