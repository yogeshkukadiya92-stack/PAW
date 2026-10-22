import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from './api';
import type { PAWQuestionOption } from './cfl-questions-data';
import { localizedOption, type AssessmentLanguage } from './assessment-i18n';
export type QuestionOverrides = Partial<Record<AssessmentLanguage,Record<number,Record<string,{word:string;description:string}>>>>;
export interface QuestionBank {revision:number;overrides:QuestionOverrides;}
const Context=createContext<{bank:QuestionBank;setBank:(bank:QuestionBank)=>void}>({bank:{revision:0,overrides:{}},setBank:()=>{}});
export function QuestionBankProvider({children}:{children:ReactNode}){
  const [bank,setBank]=useState<QuestionBank>({revision:0,overrides:{}});
  useEffect(()=>{let active=true;void api<QuestionBank>('/question-bank').then(value=>{if(active)setBank(value);}).catch(()=>{});return()=>{active=false;};},[]);
  return <Context.Provider value={{bank,setBank}}>{children}</Context.Provider>;
}
export const useQuestionBank=()=>useContext(Context);
export function optionText(q:number,option:PAWQuestionOption,language:AssessmentLanguage,overrides:QuestionOverrides) {
  const custom=overrides[language]?.[q]?.[option.temperament];
  return custom||localizedOption(q,option.temperament,language)||{word:option.word,description:option.description};
}
