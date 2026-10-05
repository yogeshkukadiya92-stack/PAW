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
  if (typeof window === 'undefined') return INITIAL_BATCHES;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BATCHES);
    return data ? JSON.parse(data) : INITIAL_BATCHES;
  } catch (e) {
    console.error('Failed to load batches from localStorage', e);
    return INITIAL_BATCHES;
  }
};

export const saveStoredBatches = (batches: PAWBatch[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(batches));
  } catch (e) {
    console.error('Failed to save batches to localStorage', e);
  }
};

export const loadStoredMembers = (): ICLMember[] => {
  if (typeof window === 'undefined') return INITIAL_MEMBERS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    return data ? JSON.parse(data) : INITIAL_MEMBERS;
  } catch (e) {
    console.error('Failed to load members from localStorage', e);
    return INITIAL_MEMBERS;
  }
};

export const saveStoredMembers = (members: ICLMember[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  } catch (e) {
    console.error('Failed to save members to localStorage', e);
  }
};


export const loadStoredLeads = (): CallingLead[] => {
  if (typeof window === 'undefined') return INITIAL_CALLING_LEADS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LEADS);
    return data ? JSON.parse(data) : INITIAL_CALLING_LEADS;
  } catch (e) {
    console.error('Failed to load leads from localStorage', e);
    return INITIAL_CALLING_LEADS;
  }
};

export const saveStoredLeads = (leads: CallingLead[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
  } catch (e) {
    console.error('Failed to save leads to localStorage', e);
  }
};

export const loadStoredParticipants = (): Participant[] => {
  if (typeof window === 'undefined') return INITIAL_PARTICIPANTS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PARTICIPANTS);
    return data ? JSON.parse(data) : INITIAL_PARTICIPANTS;
  } catch (e) {
    console.error('Failed to load participants from localStorage', e);
    return INITIAL_PARTICIPANTS;
  }
};

export const saveStoredParticipants = (participants: Participant[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PARTICIPANTS, JSON.stringify(participants));
  } catch (e) {
    console.error('Failed to save participants to localStorage', e);
  }
};

export const resetToInitialData = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.BATCHES);
  localStorage.removeItem(STORAGE_KEYS.MEMBERS);
  localStorage.removeItem(STORAGE_KEYS.LEADS);
  localStorage.removeItem(STORAGE_KEYS.PARTICIPANTS);
};
