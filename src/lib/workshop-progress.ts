import { maintenanceSchedule } from '../../shared/workshop-maintenance.mjs';
import { completionReadiness } from '../../shared/workshop-completion.mjs';
import { interventionState, localDate } from './workshop-activity';
import type { Participant, ICLMember, PAWBatch } from '@/types/paw';

export const sessionDays = [1, 2, 3] as const;
export function participantProgress(p: Participant, members: ICLMember[], batch?: PAWBatch) {
  const owner = members.find(m => m.id === p.assignedWelcomeIclMemberId);
  const leader = members.find(m => m.id === owner?.parentLeaderId);
  const sessions = sessionDays.map(day => p.followups.filter(f => f.sessionNumber === day)
    .sort((a,b) => b.date.localeCompare(a.date))[0]);
  const scheduled = batch?.sessions || [];
  const attendance = (p.sessionAttendance || []).filter(a=>scheduled.some(s=>s.id===a.sessionId));
  const attended = scheduled.length ? attendance.filter(a=>a.status==='Present'||a.status==='Late').length : sessions.filter(s => s?.attended).length;
  const recorded = scheduled.length ? attendance.length : sessions.filter(Boolean).length;
  const sessionTotal = scheduled.length || 3;
  const approved = (p.assignments||[]).filter(t=>t.history.slice(-1)[0]?.action==='Approved').length;
  const assignmentTotal = (p.assignments||[]).length;
  const complete = ['Submitted', 'Report_Generated'].includes(p.firstAssignmentStatus);
  const reasons: string[] = [];
  if (!owner) reasons.push('ICL member not assigned');
  if (p.welcomeCallStatus === 'Unreachable') reasons.push('Welcome call unreachable');
  if (scheduled.length ? attendance.some(a=>a.status==='Absent') : sessions.some(s => s && !s.attended)) reasons.push('Missed session');
  if (p.followups.some(f => f.escalatedToLeader)) reasons.push('Escalated to leader');
  if (p.followups.some(f => f.supportRequired !== 'None')) reasons.push('Support requested');
  if ((p.assignments||[]).some(t=>t.history.slice(-1)[0]?.action==='Changes_Requested')) reasons.push('Assignment corrections requested');
  const today = localDate();
  const maintenance = maintenanceSchedule(p,batch,today);
  const maintenanceDue = maintenance.filter(m=>m.status==='Overdue'||m.status==='Due today').length;
  if(maintenanceDue)reasons.push(`${maintenanceDue} post-workshop follow-up(s) due`);
  if(maintenance.some(m=>!m.done&&m.last?.outcome==='Support_Required'))reasons.push('Post-workshop support requested');
  const intervention = interventionState(p,today);
  if(intervention.open) reasons.push(intervention.overdue?'Follow-up overdue':intervention.dueToday?'Follow-up due today':'Open follow-up');
  const awaitingReview = (p.assignments||[]).filter(t=>t.history.slice(-1)[0]?.action==='Submitted').length;
  if ((p.assignments||[]).some(t=>t.dueDate<today&&(!t.history.length||t.history.slice(-1)[0]?.action==='Changes_Requested'))) reasons.push('Assignment overdue');
  const status = reasons.length ? 'Follow-up required' : !complete || approved < assignmentTotal || recorded < sessionTotal ? 'Pending' : 'On track';
  const latest = [...p.followups.map(f=>({date:f.date})),...(p.interventionEvents||[]).map(e=>({date:e.at}))].sort((a,b) => b.date.localeCompare(a.date))[0];
  return { maintenance, completion:completionReadiness(p,batch), awaitingReview, intervention, approved, assignmentTotal, sessionTotal, owner, leader, sessions, attended, recorded, complete, reasons, status, latest };
}
export function displayDate(value?: string) {
  if (!value) return 'Not recorded';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Not recorded' : date.toLocaleDateString('en-IN', {day:'numeric', month:'short', year:'numeric'});
}
