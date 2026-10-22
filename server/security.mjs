import { randomBytes, scrypt, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
const derive = promisify(scrypt);
export const SESSION_MS = 8 * 60 * 60 * 1000;
export const IDLE_MS = 30 * 60 * 1000;
export const ROLES = ['PAW_HEAD', 'LEADER_HEAD', 'LEADER', 'CALLING_MEMBER', 'WELCOME_MEMBER', 'PARTICIPANT'];
export const isManager = user => ['PAW_HEAD', 'LEADER_HEAD', 'LEADER'].includes(user.role);
export const isAdmin = user => user.role === 'PAW_HEAD';
export const digest = value => createHash('sha256').update(value).digest('hex');
export function failure(status, message) { return Object.assign(new Error(message), { status }); }
export function checkPassword(password) {
  if (typeof password !== 'string' || password.length < 12 || password.length > 128) {
    throw failure(400, 'Use a password between 12 and 128 characters.');
  }
}
export function checkUsername(value) {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9_.@+-]{2,79}$/.test(value.trim())) {
    throw failure(400, 'Use 3–80 letters, numbers, or . _ @ + - for the login ID.');
  }
  return value.trim().toLowerCase();
}
export async function hashPassword(password) {
  checkPassword(password);
  const salt = randomBytes(16).toString('hex');
  const key = await derive(password, salt, 64, { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 });
  return `${salt}:${key.toString('hex')}`;
}
export async function verifyPassword(password, stored) {
  if (typeof password !== 'string' || password.length > 128) return false;
  const [salt, hash] = stored.split(':');
  const key = await derive(password, salt, 64, { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 });
  const expected = Buffer.from(hash, 'hex');
  return key.length === expected.length && timingSafeEqual(key, expected);
}
export function publicUser(row) {
  return { id: row.id, username: row.username, name: row.name, role: row.role,
    memberId: row.member_id || undefined, participantId: row.participant_id || undefined,
    active: Boolean(row.active), mustChangePassword: Boolean(row.must_change), createdAt: row.created_at };
}
export function descendantIds(members, memberId) {
  const ids=new Set(memberId?[memberId]:[]);let changed=true;
  while(changed){changed=false;for(const member of members)if(member.parentLeaderId&&ids.has(member.parentLeaderId)&&!ids.has(member.id)){ids.add(member.id);changed=true;}}
  return ids;
}
export function visibleState(state, user) {
  if (isAdmin(user)) return structuredClone(state);
  if (isManager(user)) {
    const ids=descendantIds(state.members,user.memberId);
    return {batches:structuredClone(state.batches),members:state.members.filter(m=>ids.has(m.id)),leads:state.leads.filter(l=>ids.has(l.assignedMemberId)),participants:state.participants.filter(p=>ids.has(p.assignedWelcomeIclMemberId)||ids.has(p.assignedCallingMemberId))};
  }
  const ownLeads = user.role === 'CALLING_MEMBER' ? state.leads.filter(l => l.assignedMemberId === user.memberId) : [];
  const ownParticipants = state.participants.filter(p => user.role === 'PARTICIPANT' ? p.id === user.participantId
    : user.role === 'WELCOME_MEMBER' ? p.assignedWelcomeIclMemberId === user.memberId
    : p.assignedCallingMemberId === user.memberId);
  const batchIds = new Set([...ownLeads, ...ownParticipants].map(row => row.pawBatchId));
  // Staff can work on new batches; participants only see their enrolled batch.
  const batches = user.role === 'PARTICIPANT' ? state.batches.filter(b => batchIds.has(b.id)) : state.batches;
  const memberIds = new Set(ownParticipants.map(p => p.assignedWelcomeIclMemberId));
  memberIds.add(user.memberId);
  const members = user.role === 'PARTICIPANT' ? [] : state.members.filter(m => memberIds.has(m.id) || m.team === 'WELCOME_FOLLOWUP' && user.role === 'CALLING_MEMBER');
  // Staff directories only expose fields needed for assignment; no emails/phone numbers of others.
  return { batches, members: members.map(m => m.id === user.memberId ? m : {...m, phone: '', email: ''}), leads: ownLeads, participants: ownParticipants };
}
const participantFields = ['assessmentReports', 'preferredLanguage', 'assessmentAnswers', 'firstAssignmentStatus', 'personalityType', 'temperamentScores', 'dominantTemperament', 'secondaryTemperament'];
const welcomeFields = ['welcomeCallStatus', 'welcomeChecklist', 'whatsappGroupJoined', 'followups', ...participantFields];
const callingFields = ['callStatus', 'callLogs', 'nextFollowupDate', 'lastCalledAt'];
const changedFields = (before, after) => new Set([...Object.keys(before), ...Object.keys(after)].filter(key => JSON.stringify(before[key]) !== JSON.stringify(after[key])));
export function authorizeChange(collection, old, next, user, state) {
  if (isAdmin(user)) return;
  if (collection === 'members' || collection === 'batches' || !next) throw failure(403, 'Only the PAW Head can manage batches and team members.');
  if (isManager(user)) {
    const ids=descendantIds(state.members,user.memberId);
    const owns=record=>collection==='leads'?ids.has(record.assignedMemberId):ids.has(record.assignedWelcomeIclMemberId)||ids.has(record.assignedCallingMemberId);
    if((!old||owns(old))&&owns(next))return;
    throw failure(403,'This record is outside your assigned ICL hierarchy.');
  }
  if (collection === 'leads' && user.role === 'CALLING_MEMBER') {
    if (next.assignedMemberId !== user.memberId || old && old.assignedMemberId !== user.memberId) throw failure(403, 'This lead is not assigned to you.');
    if (!old) return;
    if ([...changedFields(old, next)].every(key => callingFields.includes(key))) return;
  }
  if (collection === 'participants') {
    if (user.role === 'PARTICIPANT' && old?.id === user.participantId && next.id === user.participantId &&
      [...changedFields(old, next)].every(key => participantFields.includes(key))) return;
    if (user.role === 'WELCOME_MEMBER' && next.assignedWelcomeIclMemberId === user.memberId && (!old || old.assignedWelcomeIclMemberId === user.memberId)) {
      if (!old || [...changedFields(old, next)].every(key => welcomeFields.includes(key))) return;
    }
    // Calling staff may register only contacts that belong to their own lead list.
    if (user.role === 'CALLING_MEMBER' && !old && next.assignedCallingMemberId === user.memberId) return;
  }
  throw failure(403, 'You do not have permission to change this record.');
}
const string = (obj, key, optional = false) => {
  if (optional && (obj[key] === undefined || obj[key] === '')) return;
  if (typeof obj[key] !== 'string' || !obj[key].trim() || obj[key].length > 2000) throw failure(400, `Invalid ${key}.`);
};
const array = (obj, key) => { if (!Array.isArray(obj[key])) throw failure(400, `Invalid ${key}.`); };
export function validateState(state) {
  for (const key of ['batches', 'members', 'leads', 'participants']) {
    array(state, key);
    if (state[key].length > 50000) throw failure(400, 'Too many records.');
    const ids = new Set();
    for (const row of state[key]) {
      if (!row || typeof row !== 'object') throw failure(400, 'Invalid record.');
      string(row, 'id');
      if (!/^[A-Za-z0-9_.:-]{1,100}$/.test(row.id)) throw failure(400, 'Invalid record ID.');
      if (ids.has(row.id)) throw failure(400, 'Duplicate record ID.');
      ids.add(row.id);
    }
  }
  for (const b of state.batches) {
    for (const key of ['name', 'code', 'startDate', 'endDate', 'welcomeStartDate']) string(b, key);
    if (!['Online','Offline'].includes(b.type) || !['Draft','Calling','Welcome','Active','Completed'].includes(b.status) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(b.startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(b.endDate) || b.endDate < b.startDate ||
      !Number.isInteger(b.totalTargetRegistrations) || b.totalTargetRegistrations < 1 || b.totalTargetRegistrations > 5000) throw failure(400, 'Invalid batch details.');
    for (const key of ['venueOrLink','pawHeadId','createdAt']) if (typeof b[key] !== 'string') throw failure(400, `Invalid batch ${key}.`);
    if (b.pawHeadId && !state.members.some(m => m.id === b.pawHeadId && m.role === 'PAW_HEAD')) throw failure(400, 'Choose an existing PAW Head.');
  }
  for (const m of state.members) {
    string(m,'name');
    if(m.parentLeaderId){
      const parent=state.members.find(p=>p.id===m.parentLeaderId);
      const expected=m.role==='LEADER_HEAD'?'PAW_HEAD':m.role==='LEADER'?'LEADER_HEAD':'LEADER';
      if(!parent||m.id===parent.id||m.role==='PAW_HEAD'||parent.role!==expected)throw failure(400,'Choose a parent from the level above this team member.');
    }
    if (!ROLES.slice(0,-1).includes(m.role) || !['CALLING','WELCOME_FOLLOWUP','LEADERSHIP'].includes(m.team) || typeof m.isAvailable !== 'boolean') throw failure(400, 'Invalid member details.');
    if (m.team === 'CALLING' && ![15,25,35].includes(m.callingCapacity)) throw failure(400,'Choose a calling capacity of 15, 25 or 35.');
    for (const key of ['phone','email']) if (typeof m[key] !== 'string') throw failure(400, `Invalid member ${key}.`);
  }
  for (const [key, field] of [['leads','assignedMemberId'],['participants','assignedWelcomeIclMemberId']]) {
    const phones = new Set();
    for (const row of state[key]) {
      for (const attr of ['fullName','phone','pawBatchId']) string(row,attr);
      if (!state.batches.some(b => b.id === row.pawBatchId)) throw failure(400, 'This batch no longer exists.');
      for (const attr of ['city',field]) if (typeof row[attr] !== 'string') throw failure(400, `Invalid ${attr}.`);
      if (key === 'leads' && !row[field]) throw failure(400, 'Assign a calling member first.');
      const member = state.members.find(m => m.id === row[field]);
      if (row[field] && (!member || member.team !== (key === 'leads' ? 'CALLING' : 'WELCOME_FOLLOWUP'))) throw failure(400, 'Choose a member from the correct team.');
      const phoneKey = `${row.pawBatchId}:${row.phone.replace(/\D/g,'')}`;
      if (phones.has(phoneKey)) throw failure(400, 'This phone number already exists in the batch.');
      phones.add(phoneKey);
      if (key === 'leads') {
        array(row,'callLogs');
        for (const log of row.callLogs) {
          if (!log || typeof log !== 'object') throw failure(400,'Invalid call log.');
          for (const attr of ['id','timestamp','status','note']) if (typeof log[attr] !== 'string') throw failure(400,'Invalid call log.');
        }
        if (!['PENDING','INTERESTED','CALLBACK_REQUESTED','NOT_REACHABLE','NOT_INTERESTED','REGISTERED'].includes(row.callStatus)) throw failure(400, 'Invalid call status.');
      } else {
        string(row,'loginId'); array(row,'followups');
        for (const log of row.followups) {
          if (!log || !Number.isInteger(log.sessionNumber) || log.sessionNumber < 0 || typeof log.attended !== 'boolean' || typeof log.assignmentCompleted !== 'boolean' || typeof log.escalatedToLeader !== 'boolean' || typeof log.iclRemark !== 'string') throw failure(400,'Invalid follow-up details.');
          for (const attr of ['id','date','supportRequired']) string(log,attr);
        }
        for (const attr of ['whatsappNumber','registeredAt','registrationStatus']) string(row,attr);
        if (typeof row.whatsappGroupJoined !== 'boolean' || !['Pending','Completed','Callback_Required','Unreachable'].includes(row.welcomeCallStatus)) throw failure(400,'Invalid welcome status.');
        if (!row.welcomeChecklist || typeof row.welcomeChecklist !== 'object' || !['en','gu','hi','mr'].includes(row.preferredLanguage)) throw failure(400, 'Invalid participant details.');
        for (const field of ['verified','datesConfirmed','whatsappConfirmed','firstAssignmentGuided','techSupportProvided','doubtsCleared','attendanceConfirmed']) if (typeof row.welcomeChecklist[field] !== 'boolean') throw failure(400,'Invalid welcome checklist.');
        if (!['Not_Started','Basic_Completed','In_Progress','Submitted','Report_Generated'].includes(row.firstAssignmentStatus)) throw failure(400, 'Invalid assessment status.');
        if (row.assessmentAnswers) {
          if (typeof row.assessmentAnswers !== 'object' || Array.isArray(row.assessmentAnswers) || Object.entries(row.assessmentAnswers).some(([q,a]) => !/^([1-9]|[1-3][0-9]|40)$/.test(q) || typeof a !== 'string' || a.length > 100)) throw failure(400, 'Invalid assessment answers.');
        }
        if (['Submitted','Report_Generated'].includes(row.firstAssignmentStatus) && Object.keys(row.assessmentAnswers || {}).length !== 40) throw failure(400, 'Complete all 40 assessment questions first.');
      }
    }
  }
  const logins = state.participants.map(p => p.loginId.toLowerCase());
  if (new Set(logins).size !== logins.length) throw failure(400,'Participant login IDs must be unique.');
}
