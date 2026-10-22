import questions from './questions.json' with { type: 'json' };
export { questions };
export const styles = ['Phlegmatic','Melancholy','Sanguine','Choleric'];
export function validAnswers(answers, complete = false) {
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) return false;
  const entries = Object.entries(answers);
  return (!complete || entries.length === 40) && entries.every(([number,value]) => {
    const question = questions.find(q => String(q.questionNumber) === number);
    return question?.options.some(option => option.value === value);
  });
}
export function scoreAssessment(answers) {
  if (!validAnswers(answers,true)) throw new Error('Answer all 40 questions before generating a report.');
  const scores=Object.fromEntries(styles.map(style=>[style,{strengths:0,weaknesses:0,total:0}]));
  for (const q of questions) {
    const option=q.options.find(o=>o.value===answers[q.questionNumber]);
    const score=scores[option.temperament];
    score[q.questionNumber<=20?'strengths':'weaknesses']++;score.total++;
  }
  const ranking=[...styles].sort((a,b)=>scores[b].total-scores[a].total);
  return {scores,dominant:ranking[0],secondary:ranking[1]};
}
