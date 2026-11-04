export const maintenanceDays = [30,60,90];
export function maintenanceSchedule(p,batch,today=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Kolkata'})) {
  if(!batch?.endDate||!/^\d{4}-\d{2}-\d{2}$/.test(batch.endDate))return [];
  const base=new Date(`${batch.endDate}T00:00:00Z`);
  if(!Number.isFinite(base.getTime())||base.toISOString().slice(0,10)!==batch.endDate)return [];
  return maintenanceDays.map(day=>{
    const date=new Date(`${batch.endDate}T00:00:00Z`);date.setUTCDate(date.getUTCDate()+day);
    const originalDue=date.toISOString().slice(0,10);
    const history=(p.maintenanceEvents||[]).filter(e=>e.day===day);
    const last=history.at(-1),done=last?.outcome==='Completed';
    const due=last?.nextFollowupDate||originalDue;
    const status=done?'Completed':due<today?'Overdue':due===today?'Due today':'Upcoming';
    return {day,originalDue,due,status,history,last,done};
  });
}
