import { useState } from 'react';
import { Eye, EyeOff, ArrowRight, LockKeyhole, Loader2 } from 'lucide-react';
import { api, type LoginUser } from '@/lib/api';
interface Props { setupRequired: boolean; setupKeyRequired: boolean; onSignedIn: (user: LoginUser) => Promise<void>; onBack?:()=>void; }
export function LoginScreen({setupRequired,setupKeyRequired,onSignedIn,onBack}: Props) {
  const [username,setUsername]=useState(''); const [name,setName]=useState('');
  const [password,setPassword]=useState(''); const [confirm,setConfirm]=useState(''); const [setupKey,setSetupKey]=useState('');
  const [show,setShow]=useState(false); const [busy,setBusy]=useState(false); const [error,setError]=useState('');
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); if (busy) return; setError('');
    if (setupRequired && password !== confirm) {setError('Your passwords do not match.');return;}
    setBusy(true);
    try {
      const result=await api<{user:LoginUser}>(setupRequired?'/auth/setup':'/auth/login','POST',{username,password,...(setupRequired?{name}:{})},setupRequired&&setupKeyRequired?{'X-PAW-Setup-Token':setupKey}:undefined);
      setPassword(''); setConfirm(''); await onSignedIn(result.user);
    } catch (e) {setError(e instanceof Error?e.message:'Unable to sign in.');} finally {setBusy(false);}
  };
  return <main className="profile-login-page"><div className="profile-login-grid">
    <section className="profile-login-intro"><h1>{setupRequired?'Set up your workspace':'Dashboard login'}</h1><p>{setupRequired?'Create your first Main Admin account. Then give each team member and participant their own login.':'Sign in with your assigned ID and password. Your dashboard opens according to your position.'}</p>{onBack&&<button className="profile-login-back" onClick={onBack}>← Continue to assessment</button>}</section>
    <section className="profile-login-form-card"><h2>{setupRequired?'Create Main Admin account':'Team & participant access'}</h2><p>{setupRequired?'Choose a private login ID and password.':'Main Admin, ICL Heads, ICL Leaders, team members and registered participants sign in here.'}</p>
        <form onSubmit={submit} className="space-y-4">
          {error&&<p role="alert" className="bg-rose-50 border border-rose-200 text-rose-700 rounded-lg p-3 text-sm">{error}</p>}
          {setupRequired&&<div><label htmlFor="login-name" className="auth-label">Your full name</label><input id="login-name" className="auth-input" autoComplete="name" required maxLength={120} value={name} onChange={e=>setName(e.target.value)}/></div>}
          <div><label htmlFor="login-id" className="auth-label">Login ID</label><input id="login-id" className="auth-input" autoComplete="username" autoCapitalize="none" spellCheck={false} required minLength={setupRequired?3:undefined} maxLength={80} placeholder={setupRequired?'Choose your login ID':'Enter your login ID'} value={username} onChange={e=>setUsername(e.target.value)}/>{setupRequired&&<p className="text-xs text-slate-500 mt-1.5">Use letters, numbers, or . _ @ + -</p>}</div>
          <div><label htmlFor="login-password" className="auth-label">Password</label><div className="relative"><input id="login-password" className="auth-input pr-12" type={show?'text':'password'} required minLength={setupRequired?12:undefined} maxLength={128} autoComplete={setupRequired?'new-password':'current-password'} value={password} onChange={e=>setPassword(e.target.value)}/><button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-500 rounded-lg" aria-label={show?'Hide password':'Show password'} onClick={()=>setShow(!show)}>{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div>{setupRequired&&<p className="text-xs text-slate-500 mt-1.5">At least 12 characters. A long phrase works well.</p>}</div>
          {setupRequired&&<div><label htmlFor="login-confirm" className="auth-label">Confirm password</label><input id="login-confirm" className="auth-input" type="password" autoComplete="new-password" required value={confirm} onChange={e=>setConfirm(e.target.value)}/></div>}
          {setupRequired&&setupKeyRequired&&<div><label htmlFor="setup-key" className="auth-label">Workspace setup key</label><input id="setup-key" className="auth-input" type="password" autoComplete="off" required value={setupKey} onChange={e=>setSetupKey(e.target.value)}/><p className="text-xs text-slate-500 mt-1.5">Provided by the administrator who installed PAW.</p></div>}
          <button disabled={busy} className="auth-primary w-full justify-center py-3">{busy?<Loader2 className="animate-spin" size={18}/>:<ArrowRight size={18}/>}<span>{busy?'Please wait…':setupRequired?'Create Main Admin account':'Sign in'}</span></button>
        </form>
        {!setupRequired&&<p className="text-xs leading-5 text-slate-500 mt-5">Need a login or forgot your password? Ask your PAW Head to create or reset your account.</p>}
      </section>
    </div>
  </main>;
}
