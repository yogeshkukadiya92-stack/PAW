import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ShieldCheck } from 'lucide-react';
import type { Participant } from '@/types/paw';
import { CFL_PAW_QUESTIONS } from '@/lib/cfl-questions-data';
import { ASSESSMENT_COPY, ASSESSMENT_LANGUAGES, type AssessmentLanguage } from '@/lib/assessment-i18n';
import { participantReports, scoreAssessment, validAnswers, type AssessmentReport } from '@/lib/assessment';
import { optionText, useQuestionBank } from '@/lib/question-bank';
import { ProfileHeader } from './ProfileHeader';
import { ProfileReport } from './ProfileReport';
import { useDialog } from '@/lib/use-dialog';
const guestKey='paw_profile_guest_v1';
const countries=[{code:'91',label:'India +91',length:10},{code:'1',label:'US/Canada +1',length:10},{code:'44',label:'UK +44',length:10},{code:'971',label:'UAE +971',length:9},{code:'61',label:'Australia +61',length:9},{code:'65',label:'Singapore +65',length:8}];
interface Details {name:string;phone:string;loginId:string;country:string;}
interface Guest {details:Details;answers:Record<number,string>;language:AssessmentLanguage;reports:AssessmentReport[];}
function readGuest():Guest|null {
  try{
    const parsed=JSON.parse(localStorage.getItem(guestKey)||'null');
    if(!parsed||!parsed.details||['name','phone','loginId','country'].some(key=>typeof parsed.details[key]!=='string')||!countries.some(c=>c.code===parsed.details.country)||!validAnswers(parsed.answers)||!['en','hi','gu','mr'].includes(parsed.language)||!Array.isArray(parsed.reports))return null;
    parsed.reports=parsed.reports.filter((r:AssessmentReport)=>r&&typeof r.id==='string'&&Number.isFinite(Date.parse(r.completedAt))&&['en','hi','gu','mr'].includes(r.language)&&validAnswers(r.answers,true)).map((r:AssessmentReport)=>({...r,...scoreAssessment(r.answers)}));
    return parsed;
  }catch{return null;}
}
interface Props {participant?:Participant;onSignIn?:()=>void;onSignUp?:()=>void;onExit?:()=>void;onSaveProgress?:(id:string,answers:Record<number,string>)=>void;onComplete?:(id:string,report:AssessmentReport)=>void;}
export function AssessmentExperience({participant,onSignIn,onSignUp,onExit,onSaveProgress,onComplete}:Props) {
  const [guest]=useState(()=>participant?null:readGuest());
  const [language,setLanguage]=useState<AssessmentLanguage>(participant?.preferredLanguage||guest?.language||'en');
  const [details,setDetails]=useState<Details>(()=>{
    if(!participant)return guest?.details||{name:'',phone:'',loginId:'',country:'91'};
    const digits=participant.phone.replace(/\D/g,'');const country=countries.find(c=>digits.startsWith(c.code)&&digits.length===c.code.length+c.length);
    return {name:participant.fullName,phone:country?digits.slice(country.code.length):digits,loginId:participant.loginId,country:country?.code||'91'};
  });
  const [answers,setAnswers]=useState<Record<number,string>>(participant?.assessmentAnswers||guest?.answers||{});
  const [reports,setReports]=useState<AssessmentReport[]>(participant?participantReports(participant):guest?.reports||[]);
  const [activeReport,setActiveReport]=useState<AssessmentReport|null>(participant?.firstAssignmentStatus==='Report_Generated'?participantReports(participant)[0]||null:null);
  const [step,setStep]=useState<1|2|3>(activeReport?3:1);
  const [error,setError]=useState('');const [storageError,setStorageError]=useState('');const [mobile,setMobile]=useState(false);
  const {bank}=useQuestionBank();const root=useRef<HTMLDivElement>(null);const t=ASSESSMENT_COPY[language];
  const visibleReports=participant?reports:reports.filter(report=>!report.identity||(report.identity.name.trim().toLowerCase()===details.name.trim().toLowerCase()&&report.identity.phone.replace(/\D/g,'')===details.phone.replace(/\D/g,'')));
  const reportIdentity=activeReport?.identity||details;
  const count=CFL_PAW_QUESTIONS.filter(q=>q.options.some(o=>o.value===answers[q.questionNumber])).length;
  useEffect(()=>{
    if(participant)return;
    try{localStorage.setItem(guestKey,JSON.stringify({details,answers,language,reports}));setStorageError('');}catch{setStorageError('This browser could not save your assessment. Keep this page open until you download your report.');}
  },[details,answers,language,reports,participant?.id]);
  const nextStep=(value:1|2|3)=>{setStep(value);setError('');requestAnimationFrame(()=>{root.current?.querySelector<HTMLElement>('h1')?.focus();root.current?.scrollIntoView({block:'start',behavior:'auto'});});};
  const start=(event:React.FormEvent)=>{
    event.preventDefault();if(!details.name.trim()||!details.loginId.trim()){setError('Enter your full name and login ID.');return;}
    const selected=countries.find(c=>c.code===details.country)!;
    if(!participant&&details.phone.replace(/\D/g,'').length!==selected.length){setError(`Enter a valid ${selected.length}-digit WhatsApp number for ${selected.label}.`);return;}
    nextStep(2);
  };
  const choose=(question:number,value:string)=>{const next={...answers,[question]:value};setAnswers(next);setError('');if(participant)onSaveProgress?.(participant.id,next);};
  const finish=()=>{
    if(!validAnswers(answers,true)){setError(`${t.answered}: ${count}/40. ${t.instructions}`);const first=CFL_PAW_QUESTIONS.find(q=>!q.options.some(o=>o.value===answers[q.questionNumber]));root.current?.querySelector(`#profile-question-${first?.questionNumber}`)?.scrollIntoView({block:'center',behavior:'auto'});return;}
    const report:AssessmentReport={id:crypto.randomUUID(),completedAt:new Date().toISOString(),language,answers:{...answers},...(!participant?{identity:{...details}}:{}),...scoreAssessment(answers)};
    if(participant)onComplete?.(participant.id,report);
    setReports(previous=>[report,...previous]);setActiveReport(report);nextStep(3);
  };
  const retry=()=>{setAnswers({});setActiveReport(null);nextStep(2);};
  return <div className={`profile-app ${mobile?'profile-mobile-preview':''}`} ref={root} lang={language}>
    <ProfileHeader language={language} onLanguage={setLanguage} onSignIn={onSignIn} onSignUp={onSignUp} onDashboard={onExit} onMobile={()=>setMobile(!mobile)} mobile={mobile} onHome={()=>nextStep(1)}/>
    <div className="profile-container">
      <nav className="profile-stepper no-print" aria-label="Assessment progress">{[t.basicDetails,t.questions,t.yourReport].map((label,index)=><div key={index} className={step>=index+1?'active':''} aria-current={step===index+1?'step':undefined}><span>{step>index+1?<Check size={15}/>:index+1}</span><strong>{label}</strong></div>)}</nav>
      {(error||storageError)&&<p role="alert" className="profile-error no-print">{error||storageError}</p>}
      {step===1&&<div className="profile-basic-grid"><section className="profile-intro"><h1 tabIndex={-1}>{t.basicsTitle}</h1><p>{t.basicsDescription}</p><div className="profile-privacy"><ShieldCheck size={19}/><p>{participant?t.privacyMember:t.privacyGuest}</p></div>{visibleReports.length>0&&<div className="profile-previous"><h2>{t.savedReports}</h2>{visibleReports.map(report=><button key={report.id} onClick={()=>{setActiveReport(report);setLanguage(report.language);nextStep(3);}}>{new Date(report.completedAt).toLocaleDateString()}<span>{t.viewReport} →</span></button>)}</div>}</section><form className="profile-basics-form" onSubmit={start}>
        <div><label htmlFor="profile-name">{t.fullName}</label><input id="profile-name" required maxLength={120} autoComplete="name" placeholder={t.fullName} value={details.name} readOnly={!!participant} onChange={e=>setDetails({...details,name:e.target.value})}/></div>
        <div><label htmlFor="profile-phone">{t.whatsapp}</label><div className="profile-phone"><select aria-label="Country code" value={details.country} disabled={!!participant} onChange={e=>setDetails({...details,country:e.target.value})}>{countries.map(c=><option key={c.code} value={c.code}>{c.label}</option>)}</select><input id="profile-phone" required type="tel" inputMode="numeric" autoComplete="tel-national" placeholder={t.whatsapp} value={details.phone} readOnly={!!participant} onChange={e=>setDetails({...details,phone:e.target.value})}/></div></div>
        <div><label htmlFor="profile-login">{t.loginId}</label><input id="profile-login" required maxLength={80} autoComplete="username" placeholder="Enter your login ID or email" value={details.loginId} readOnly={!!participant} onChange={e=>setDetails({...details,loginId:e.target.value})}/></div>
        <fieldset><legend>{t.language}</legend><div className="profile-languages">{ASSESSMENT_LANGUAGES.map(l=><label key={l.value} className={language===l.value?'selected':''}><input type="radio" name="assessment-language" value={l.value} checked={language===l.value} onChange={()=>setLanguage(l.value)}/><span>{l.label}</span></label>)}</div></fieldset>
        <button className="profile-button primary profile-start">{t.start}<ArrowRight size={17}/></button><p className="profile-timing">{t.minutes}</p>
      </form></div>}
      {step===2&&<section className="profile-questions"><div className="profile-question-heading"><div><h1 tabIndex={-1}>{t.questions}</h1><p className="profile-muted">{t.instructions}</p></div><button className="profile-button secondary" onClick={()=>nextStep(1)}><ArrowLeft size={16}/>{t.back}</button></div><div className="profile-progress"><span>{t.answered}: <strong>{count}/40</strong></span><div className="profile-bar"><span style={{width:`${count/40*100}%`}}/></div></div>
        {[0,1].map(part=><section key={part} className="profile-question-group"><div className="profile-group-heading"><h2>{part===0?t.strengths:t.weaknesses}</h2><span>{part===0?'1–20':'21–40'}</span></div>{CFL_PAW_QUESTIONS.slice(part*20,part*20+20).map(q=><article id={`profile-question-${q.questionNumber}`} key={q.questionNumber} className={`profile-question-row ${answers[q.questionNumber]?'has-answer':''}`}><div className="profile-question-number"><strong>{String(q.questionNumber).padStart(2,'0')}</strong><span>{part===0?t.strengths:t.weaknesses}</span></div><fieldset className="profile-options"><legend className="sr-only">{q.questionNumber}. {t.chooseOne}</legend>{q.options.map(option=>{const content=optionText(q.questionNumber,option,language,bank.overrides);return <label key={option.value} className={answers[q.questionNumber]===option.value?'selected':''}><input type="radio" name={`profile-q${q.questionNumber}`} value={option.value} checked={answers[q.questionNumber]===option.value} onChange={()=>choose(q.questionNumber,option.value)}/><span><strong>{content.word}</strong><small>{content.description}</small></span></label>;})}</fieldset></article>)}</section>)}
        <div className="profile-submit"><span>{t.answered}: {count}/40</span><button className="profile-button primary" onClick={finish}>{t.generate}<ArrowRight size={16}/></button></div>
      </section>}
      {step===3&&activeReport&&<ProfileReport displayLanguage={language} report={activeReport} name={reportIdentity.name} loginId={reportIdentity.loginId} phone={`+${reportIdentity.country} ${reportIdentity.phone}`} onNew={retry}/>}
    </div>
  </div>;
}
export function AssessmentExperienceModal(props:Props&{isOpen:boolean;onClose:()=>void}){return props.isOpen?<ModalContent {...props}/>:null;}
function ModalContent(props:Props&{onClose:()=>void}){const ref=useDialog(props.onClose);return <div ref={ref} className="profile-modal" role="dialog" aria-modal="true" aria-label="Personality assessment" tabIndex={-1}><div><AssessmentExperience {...props} onExit={props.onClose}/></div></div>;}
