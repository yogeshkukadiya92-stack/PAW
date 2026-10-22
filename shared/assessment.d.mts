import type { PAWQuestion, TemperamentType } from '../src/lib/cfl-questions-data';
export const questions: PAWQuestion[];
export const styles: TemperamentType[];
export function validAnswers(answers: unknown, complete?: boolean): boolean;
export function scoreAssessment(answers: Record<number,string>): {scores:Record<TemperamentType,{strengths:number;weaknesses:number;total:number}>;dominant:TemperamentType;secondary:TemperamentType};
