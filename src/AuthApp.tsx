import { useCallback, useEffect, useState } from 'react';
import App from './App';
import { api, type LoginUser, type Snapshot } from '@/lib/api';
import { LoginScreen } from '@/components/LoginScreen';
import { AssessmentExperience } from '@/components/AssessmentExperience';
import { ProfileHeader } from '@/components/ProfileHeader';
import type { AssessmentLanguage } from '@/lib/assessment-i18n';
import { PasswordForm } from '@/components/PasswordForm';
interface AuthStatus { setupRequired: boolean; setupKeyRequired:boolean; user:LoginUser|null; }
export default function AuthApp() {
  const readScreen=()=>['#sign-in','#sign-up','#setup'].includes(window.location.hash)?window.location.hash.slice(1):'assessment';
  const [screen,setScreen]=useState(readScreen);
  const [language,setLanguage]=useState<AssessmentLanguage>('en');
  const changeScreen=(target:string)=>{window.location.hash=target;setScreen(target);};
  useEffect(()=>{const changed=()=>setScreen(readScreen());window.addEventListener('hashchange',changed);return()=>window.removeEventListener('hashchange',changed);},[]);
  const [status,setStatus]=useState<AuthStatus|null>(null);const [snapshot,setSnapshot]=useState<Snapshot|null>(null);
  const [loading,setLoading]=useState(true);const [error,setError]=useState('');
  const signedIn=useCallback(async(user:LoginUser)=>{
    setSnapshot(null);setStatus({setupRequired:false,setupKeyRequired:false,user});
    if (!user.mustChangePassword) { const fresh=await api<Snapshot>('/state');setSnapshot(fresh); }
  },[]);
  const load=useCallback(async()=>{setLoading(true);setError('');try{const result=await api<AuthStatus>('/auth/status');setStatus(result);if(result.user&&!result.user.mustChangePassword)setSnapshot(await api<Snapshot>('/state'));}catch(e){setError(e instanceof Error?e.message:'Unable to open PAW.');}finally{setLoading(false);}},[]);
  useEffect(()=>{void load();const expired=()=>{setSnapshot(null);setStatus(old=>old?{...old,user:null}:null);};window.addEventListener('paw-session-expired',expired);return()=>window.removeEventListener('paw-session-expired',expired);},[load]);
  const logout=async()=>{await api('/auth/logout','POST',{});setSnapshot(null);setStatus({setupRequired:false,setupKeyRequired:false,user:null});changeScreen('assessment');};
  if(loading)return <main className="min-h-screen flex items-center justify-center text-slate-600" role="status">Opening PAW…</main>;
  if(error)return <main className="min-h-screen flex items-center justify-center p-4"><div className="sober-card rounded-2xl p-6 max-w-md space-y-4"><h1 className="text-xl font-bold">Unable to connect</h1><p role="alert" className="text-sm text-slate-600">{error}</p><button className="auth-primary" onClick={()=>void load()}>Try again</button></div></main>;
  if(!status)return null;
  if(!status.user){
    if(screen==='assessment')return <AssessmentExperience onSignIn={()=>changeScreen('sign-in')} onSignUp={()=>changeScreen('sign-up')}/>;
    return <div className="profile-app"><ProfileHeader language={language} onLanguage={setLanguage} onHome={()=>changeScreen('assessment')}/><LoginScreen key={screen} mode={screen==='setup'?'setup':screen==='sign-up'?'sign-up':'sign-in'} onMode={changeScreen} setupRequired={status.setupRequired} setupKeyRequired={status.setupKeyRequired} onSignedIn={signedIn} onBack={()=>changeScreen('assessment')}/></div>;
  }
  if(status.user.mustChangePassword)return <main className="min-h-screen flex items-center justify-center p-4"><div className="sober-card rounded-2xl p-6 sm:p-8 w-full max-w-md"><p className="text-sm text-slate-500 mb-5">Signed in as {status.user.name}</p><PasswordForm user={status.user} onChanged={user=>void signedIn(user).catch(e=>setError(e.message))}/><button className="text-sm text-slate-600 underline mt-5" onClick={()=>void logout().catch(e=>setError(e.message))}>Sign out</button></div></main>;
  if(!snapshot)return <main className="min-h-screen flex items-center justify-center p-4"><div className="sober-card rounded-2xl p-6 space-y-3"><p>Your session is active. Load your workspace to continue.</p><button className="auth-primary" onClick={()=>void load()}>Open workspace</button><button className="auth-secondary" onClick={()=>void logout().catch(e=>setError(e.message))}>Sign out</button></div></main>;
  return <App key={status.user.id} user={status.user} initialState={snapshot} onLogout={logout} onUserChange={user=>setStatus(old=>old?{...old,user}:old)}/>;
}
