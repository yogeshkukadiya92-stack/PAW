import type { Participant, PAWBatch, MaintenanceEvent } from '../src/types/paw';
export const maintenanceDays: number[];
export function maintenanceSchedule(p:Participant,batch?:PAWBatch,today?:string):{day:number;originalDue:string;due:string;status:'Completed'|'Overdue'|'Due today'|'Upcoming';history:MaintenanceEvent[];last?:MaintenanceEvent;done:boolean}[];
