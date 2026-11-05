import { useEffect, useState } from 'react';
import { CFL_PAW_QUESTIONS } from '@/lib/cfl-questions-data';
import { ASSESSMENT_LANGUAGES, type AssessmentLanguage } from '@/lib/assessment-i18n';
import { optionText, useQuestionBank, type QuestionBank, type QuestionOverrides } from '@/lib/question-bank';
import { styleNames } from '@/lib/assessment';
import { api } from '@/lib/api';
const styles=['Sanguine','Choleric','Melancholy','Phlegmatic'] as const;
export function QuestionBankEditor(){
  const {bank,setBank}=useQuestionBank();const [draft,setDraft]=useState<QuestionOverrides>(structuredClone(bank.overrides));const [language,setLanguage]=useState<AssessmentLanguage>('en');const [group,setGroup]=useState('0');const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');const [error,setError]=useState('');
  useEffect(()=>{setDraft(structuredClone(bank.overrides));},[bank.revision]);
  const edit=(q:number,style:string,field:'word'|'description',value:string)=>{
    const option=CFL_PAW_QUESTIONS[q-1].options.find(o=>o.temperament===style)!;
    const original=optionText(q,option,language,draft);
    setDraft(previous=>({...previous,[language]:{...previous[language],[q]:{...previous[language]?.[q],[style]:{...original,[field]:value}}}}));setMessage('');
  };
  const save=async()=>{setBusy(true);setError('');setMessage('');try{const updated=await api<QuestionBank>('/question-bank','PUT',{revision:bank.revision,overrides:draft});setBank(updated);setMessage('Question bank saved for everyone. Existing report scores are preserved.');}catch(e){setError(e instanceof Error?e.message:'Could not save questions.');}finally{setBusy(false);}};
  return <section className="profile-question-editor"><div className="profile-question-heading"><div><h2>Question bank</h2><p className="profile-muted">Edit the wording and explanations. Question numbering and scoring styles stay consistent.</p></div><div className="profile-filters"><label>Language<select value={language} onChange={e=>setLanguage(e.target.value as AssessmentLanguage)}>{ASSESSMENT_LANGUAGES.map(l=><option key={l.value} value={l.value}>{l.label}</option>)}</select></label><label>Question group<select value={group} onChange={e=>setGroup(e.target.value)}><option value="0">Strengths 1–20</option><option value="1">Weaknesses 21–40</option></select></label></div></div>
    <div className="profile-editor-questions">
      {CFL_PAW_QUESTIONS.slice(Number(group)*20,Number(group)*20+20).map(q=>(
        <article className="profile-editor-question" key={q.questionNumber}>
          <h3>Question {String(q.questionNumber).padStart(2,'0')} <small>{q.type}</small></h3>
          <div className="profile-editor-options">
            {styles.map(style=>{
              const option=q.options.find(o=>o.temperament===style)!;
              const content=optionText(q.questionNumber,option,language,draft);
              const label=`Question ${q.questionNumber} ${styleNames[style]}`;
              return (
                <div className="profile-editor-option" key={style}>
                  <h4>{styleNames[style]}</h4>
                  <input aria-label={`${label} word`} maxLength={160} value={content.word} onChange={e=>edit(q.questionNumber,style,'word',e.target.value)}/>
                  <textarea aria-label={`${label} description`} rows={4} maxLength={600} value={content.description} onChange={e=>edit(q.questionNumber,style,'description',e.target.value)}/>
                </div>
              );
            })}
          </div>
        </article>
      ))}
    </div>
    <div className="profile-editor-footer">
      {error&&<p role="alert" className="profile-error">{error}</p>}
      {message&&<p role="status" className="profile-saved">{message}</p>}
      <div className="profile-submit"><button type="button" className="profile-button secondary" disabled={busy} onClick={()=>{if(!window.confirm('Restore the default words and descriptions for this language? Save changes to apply the reset.'))return;setDraft(previous=>{const next={...previous};delete next[language];return next;});setMessage('Language reset in your draft. Save changes to publish it.');}}>Reset language</button><button className="profile-button primary" disabled={busy} onClick={()=>void save()}>{busy?'Saving…':'Save changes'}</button></div>
    </div>
  </section>;
}
