import { scoreAssessment, validAnswers } from '../shared/assessment.mjs';
import { failure } from './security.mjs';
const languages=['en','hi','gu','mr'];const styles=['Phlegmatic','Melancholy','Sanguine','Choleric'];
export function validateOverrides(overrides){
  if(!overrides||typeof overrides!=='object'||Array.isArray(overrides))throw failure(400,'Invalid question bank.');
  for(const [language,questions]of Object.entries(overrides)){
    if(!languages.includes(language)||!questions||typeof questions!=='object'||Array.isArray(questions))throw failure(400,'Invalid question language.');
    for(const [number,options]of Object.entries(questions)){
      if(!/^([1-9]|[1-3][0-9]|40)$/.test(number)||!options||typeof options!=='object'||Array.isArray(options))throw failure(400,'Invalid question number.');
      for(const [style,content]of Object.entries(options)){
        if(!styles.includes(style)||!content||typeof content.word!=='string'||!content.word.trim()||content.word.length>160||typeof content.description!=='string'||!content.description.trim()||content.description.length>600)throw failure(400,'Each edited option needs a word and explanation.');
        if(Object.keys(content).some(key=>!['word','description'].includes(key)))throw failure(400,'Question scoring cannot be changed in this editor.');
      }
    }
  }
}
export function normalizeReports(next,previous){
  for(const participant of next.participants){
    const original=previous.participants.find(p=>p.id===participant.id);
    if(participant.assessmentAnswers&&!validAnswers(participant.assessmentAnswers))throw failure(400,'Assessment answers must use valid question options.');
    if(participant.firstAssignmentStatus==='Report_Generated'&&validAnswers(participant.assessmentAnswers,true)){
      const result=scoreAssessment(participant.assessmentAnswers);participant.temperamentScores=result.scores;participant.dominantTemperament=result.dominant;participant.secondaryTemperament=result.secondary;
    }
    if(participant.assessmentReports===undefined)continue;
    if(!Array.isArray(participant.assessmentReports)||participant.assessmentReports.length>100)throw failure(400,'Invalid assessment history.');
    const previousReports=original?.assessmentReports||[];const ids=new Set();
    for(const report of participant.assessmentReports){
      if(!report||typeof report.id!=='string'||!/^[a-zA-Z0-9-]{1,100}$/.test(report.id)||ids.has(report.id)||!languages.includes(report.language)||!validAnswers(report.answers,true))throw failure(400,'Invalid completed report.');
      ids.add(report.id);
      const existing=previousReports.find(r=>r.id===report.id);
      if(existing){if(JSON.stringify(existing)!==JSON.stringify(report))throw failure(400,'Saved reports cannot be edited. Start a new assessment.');continue;}
      const result=scoreAssessment(report.answers);report.scores=result.scores;report.dominant=result.dominant;report.secondary=result.secondary;report.completedAt=new Date().toISOString();
    }
    if(previousReports.some(report=>!ids.has(report.id)))throw failure(400,'Saved report history cannot be removed.');
  }
}
