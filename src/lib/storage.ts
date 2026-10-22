import { PAWBatch, ICLMember, CallingLead, Participant } from '@/types/paw';
import { INITIAL_BATCHES, INITIAL_MEMBERS, INITIAL_CALLING_LEADS, INITIAL_PARTICIPANTS } from './mock-data';

const STORAGE_KEYS = {
  BATCHES: 'paw_os_batches_v1',
  MEMBERS: 'paw_os_members_v1',
  LEADS: 'paw_os_leads_v1',
  PARTICIPANTS: 'paw_os_participants_v1',
  SELECTED_BATCH_ID: 'paw_os_selected_batch_id_v1',
};

export const loadStoredBatches = (): PAWBatch[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BATCHES);
    const parsed = data ? JSON.parse(data) : [];
    return Array.isArray(parsed) ? parsed.filter(record => !INITIAL_BATCHES.some(seed => JSON.stringify(seed) === JSON.stringify(record))) : [];
  } catch (e) {
    console.error('Failed to load batches from localStorage', e);
    return [];
  }
};

export const saveStoredBatches = (batches: PAWBatch[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(batches));
  } catch (e) {
    console.error('Failed to save batches to localStorage', e);
    window.dispatchEvent(new Event('paw-storage-error'));
  }
};

export const loadStoredMembers = (): ICLMember[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    const parsed = data ? JSON.parse(data) : [];
    return Array.isArray(parsed) ? parsed.filter(record => !INITIAL_MEMBERS.some(seed => JSON.stringify(seed) === JSON.stringify(record))) : [];
  } catch (e) {
    console.error('Failed to load members from localStorage', e);
    return [];
  }
};

export const saveStoredMembers = (members: ICLMember[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  } catch (e) {
    console.error('Failed to save members to localStorage', e);
    window.dispatchEvent(new Event('paw-storage-error'));
  }
};


export const loadStoredLeads = (): CallingLead[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LEADS);
    const parsed = data ? JSON.parse(data) : [];
    return Array.isArray(parsed) ? parsed.filter(record => !INITIAL_CALLING_LEADS.some(seed => JSON.stringify(seed) === JSON.stringify(record))) : [];
  } catch (e) {
    console.error('Failed to load leads from localStorage', e);
    return [];
  }
};

export const saveStoredLeads = (leads: CallingLead[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
  } catch (e) {
    console.error('Failed to save leads to localStorage', e);
    window.dispatchEvent(new Event('paw-storage-error'));
  }
};

export const loadStoredParticipants = (): Participant[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PARTICIPANTS);
    const parsed = data ? JSON.parse(data) : [];
    return Array.isArray(parsed) ? parsed.filter(record => !INITIAL_PARTICIPANTS.some(seed => JSON.stringify(seed) === JSON.stringify(record))) : [];
  } catch (e) {
    console.error('Failed to load participants from localStorage', e);
    return [];
  }
};

export const saveStoredParticipants = (participants: Participant[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(participants));
  } catch (e) {
    console.error('Failed to save participants to localStorage', e);
    window.dispatchEvent(new Event('paw-storage-error'));
  }
};

export const removeDemoData = () => {
  const collections = [
    [STORAGE_KEYS.BATCHES, INITIAL_BATCHES],
    [STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS],
    [STORAGE_KEYS.LEADS, INITIAL_CALLING_LEADS],
    [STORAGE_KEYS.PARTICIPANTS, INITIAL_PARTICIPANTS],
  ] as const;
  for (const [key, seeds] of collections) {
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    if (!Array.isArray(stored)) continue;
    // Only remove unchanged seed records; retain records edited by the user.
    const remaining = stored.filter(record => !seeds.some(seed => JSON.stringify(seed) === JSON.stringify(record)));
    localStorage.setItem(key, JSON.stringify(remaining));
  }
};
