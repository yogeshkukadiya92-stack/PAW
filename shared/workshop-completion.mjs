export function completionReadiness(p, batch, now = Date.now()) {
  const blockers = [];
  if (p.firstAssignmentStatus !== 'Report_Generated') blockers.push('Personality report not generated');
  const tasks = p.assignments || [];
  const approved = tasks.filter(t => t.history.at(-1)?.action === 'Approved').length;
  if (approved < tasks.length) blockers.push(`${tasks.length - approved} workshop assignment(s) not approved`);
  const sessions = batch?.sessions || [];
  let total = sessions.length || 3, present = 0, recorded = 0;
  if (sessions.length) {
    for (const s of sessions) {
      const a = p.sessionAttendance?.find(a => a.sessionId === s.id);
      if (a) recorded++;
      if (a && ['Present','Late'].includes(a.status)) present++;
    }
    if (sessions.some(s => Date.parse(s.startsAt) > now)) blockers.push('Scheduled sessions still upcoming');
  } else {
    for (const day of [1,2,3]) {
      const f = p.followups.filter(f => f.sessionNumber === day).sort((a,b) => b.date.localeCompare(a.date))[0];
      if (f) recorded++;
      if (f?.attended) present++;
    }
  }
  if (present < total) blockers.push(`${total - present} session(s) without Present / Late attendance`);
  const followup = p.interventionEvents?.at(-1);
  if (followup && followup.action !== 'Resolved') blockers.push('Open follow-up');
  if (p.followups.some(f => f.escalatedToLeader)) blockers.push('Unresolved leader escalation');
  const last = p.completionEvents?.at(-1);
  const ready = blockers.length === 0;
  const status = last?.action === 'Completed' ? ready ? 'Completed' : 'Needs review' : ready ? 'Ready for review' : 'In progress';
  return {ready, blockers, approved, taskTotal:tasks.length, present, recorded, sessionTotal:total, status};
}
