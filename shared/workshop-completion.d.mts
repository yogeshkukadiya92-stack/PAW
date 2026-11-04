import type { Participant, PAWBatch } from '../src/types/paw';
export function completionReadiness(p:Participant,batch?:PAWBatch,now?:number):{ready:boolean;blockers:string[];approved:number;taskTotal:number;present:number;recorded:number;sessionTotal:number;status:'Completed'|'Needs review'|'Ready for review'|'In progress'};
