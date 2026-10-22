import type { Participant, PreferredLanguage } from '@/types/paw';
import type { TemperamentType } from './cfl-questions-data';
export { scoreAssessment, validAnswers, styles } from '../../shared/assessment.mjs';
export interface AssessmentReport {
  identity?:{name:string;phone:string;loginId:string;country:string};
  id:string;completedAt:string;language:PreferredLanguage;answers:Record<number,string>;
  scores:Record<TemperamentType,{strengths:number;weaknesses:number;total:number}>;
  dominant:TemperamentType;secondary:TemperamentType;
}
export const styleNames:Record<TemperamentType,string>={Phlegmatic:'Peaceful',Melancholy:'Perfect',Sanguine:'Popular',Choleric:'Powerful'};
export function participantReports(participant:Participant):AssessmentReport[] {
  if (participant.assessmentReports?.length) return [...participant.assessmentReports];
  if (participant.firstAssignmentStatus==='Report_Generated' && participant.temperamentScores && participant.dominantTemperament && participant.secondaryTemperament) {
    return [{id:`legacy-${participant.id}`,completedAt:participant.registeredAt,language:participant.preferredLanguage,answers:participant.assessmentAnswers||{},scores:participant.temperamentScores,dominant:participant.dominantTemperament as TemperamentType,secondary:participant.secondaryTemperament as TemperamentType}];
  }
  return [];
}
