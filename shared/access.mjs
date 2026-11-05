export const ACCESS = {
  workspace: 'View assigned workshop records',
  calling: 'Update sales leads and calls',
  welcome: 'Update welcome calls and participant details',
  assignments: 'Update assignments and assessments',
  attendance: 'Record session attendance',
  followups: 'Record follow-ups',
  completion: 'Record workshop completion'
};
export function defaultAccess(role) {
  if(role==='PAW_HEAD')return Object.keys(ACCESS);
  if(role==='CALLING_MEMBER')return ['workspace','calling','welcome'];
  if(role==='WELCOME_MEMBER')return ['workspace','welcome','assignments','attendance','followups'];
  if(role==='PARTICIPANT')return ['workspace','assignments'];
  return Object.keys(ACCESS);
}
export function accessFor(user){return user.role==='PAW_HEAD'?Object.keys(ACCESS):Array.isArray(user.permissions)?user.permissions:defaultAccess(user.role);}
export function checkAccessChange(collection,old,next,user){
  if(user.role==='PAW_HEAD')return null;
  const granted=accessFor(user);
  if(!granted.includes('workspace'))return 'Workspace access is disabled.';
  const keys=new Set([...Object.keys(old||{}),...Object.keys(next||{})].filter(k=>JSON.stringify(old?.[k])!==JSON.stringify(next?.[k])));
  if(collection==='leads'&&!granted.includes('calling'))return 'You do not have permission to update calling records.';
  if(collection==='participants'){
    const groups={assignments:['assignments','assessmentReports','assessmentAnswers','firstAssignmentStatus','personalityType','temperamentScores','dominantTemperament','secondaryTemperament','personalityReportUrl'],attendance:['sessionAttendance'],followups:['followups','interventionEvents','maintenanceEvents'],completion:['completionEvents']};
    if(!old&&!granted.includes('welcome'))return 'You do not have permission to register participants.';
    for(const key of keys){const permission=Object.entries(groups).find(([,fields])=>fields.includes(key))?.[0]||'welcome';if(!granted.includes(permission))return `You do not have permission to update ${permission}.`;}
  }
  return null;
}
