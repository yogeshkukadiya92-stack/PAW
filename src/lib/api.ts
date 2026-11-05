import type { PAWBatch, ICLMember, CallingLead, Participant, UserRole } from '@/types/paw';
export type LoginRole = UserRole | 'PARTICIPANT';
export interface LoginUser {
  permissions?: string[]; id: string; username: string; name: string; role: LoginRole; memberId?: string; participantId?: string;
  active: boolean; mustChangePassword: boolean; createdAt: string;
}
export interface WorkspaceData { batches: PAWBatch[]; members: ICLMember[]; leads: CallingLead[]; participants: Participant[]; }
export interface Snapshot { data: WorkspaceData; revision: number; }
export const roleLabels: Record<LoginRole, string> = { PAW_HEAD: 'Main Admin', LEADER_HEAD: 'ICL Head', LEADER: 'ICL Leader', CALLING_MEMBER: 'Calling Member', WELCOME_MEMBER: 'Welcome Member', PARTICIPANT: 'Participant' };
export const canManage = (user: LoginUser) => ['PAW_HEAD','LEADER_HEAD','LEADER'].includes(user.role);
export class ApiError extends Error { constructor(message: string, public status: number) { super(message); } }
export async function api<T>(path: string, method = 'GET', body?: unknown, headers?: Record<string,string>): Promise<T> {
  let response: Response;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    response = await fetch(`/api${path}`, { method, signal: controller.signal, credentials: 'same-origin', headers: { ...(method !== 'GET' ? {'Content-Type':'application/json'} : {}), ...headers }, ...(body === undefined ? {} : {body:JSON.stringify(body)}) });
  } catch { throw new ApiError('Cannot connect to PAW. Check your connection and try again.',0); }
  finally {clearTimeout(timeout);}
  let result: any;
  try { result = await response.json(); } catch { throw new ApiError('The PAW server is not available. Please try again.',response.status); }
  if (!response.ok) {
    if (response.status === 401 && path !== '/auth/login') window.dispatchEvent(new Event('paw-session-expired'));
    throw new ApiError(result.error || 'Unable to complete this request.',response.status);
  }
  return result as T;
}
export function diffState(before: WorkspaceData, after: WorkspaceData) {
  const changes: Record<string, {upsert: unknown[]; remove: string[]; before: Record<string,unknown>}> = {};
  for (const key of ['batches','members','leads','participants'] as const) {
    const previous = new Map(before[key].map(row => [row.id,JSON.stringify(row)]));
    const ids = new Set(after[key].map(row => row.id));
    const upsert = after[key].filter(row => previous.get(row.id) !== JSON.stringify(row));
    const remove = before[key].filter(row => !ids.has(row.id)).map(row => row.id);
    if (upsert.length || remove.length) {
      const before = Object.fromEntries([...upsert.map(row=>row.id),...remove].map(id=>[id,previous.has(id)?JSON.parse(previous.get(id)!):null]));
      changes[key] = {upsert,remove,before};
    }
  }
  return changes;
}

export function mergePending(base: WorkspaceData, pending: ReturnType<typeof diffState>): WorkspaceData {
  const merged = structuredClone(base);
  for (const key of ['batches','members','leads','participants'] as const) {
    const delta = pending[key]; if (!delta) continue;
    const rows: any[] = merged[key];
    for (const raw of delta.upsert) {
      const row = raw as {id:string}; const index = rows.findIndex(item=>item.id===row.id);
      if (index < 0) rows.unshift(row); else rows[index]=row;
    }
    (merged[key] as unknown[]) = rows.filter(row=>!delta.remove.includes(row.id));
  }
  return merged;
}
