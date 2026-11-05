import { useState } from 'react';
import { api, type LoginUser } from '@/lib/api';
export function PasswordForm({user,onChanged,onCancel}: {user:LoginUser;onChanged:(user:LoginUser)=>void;onCancel?:()=>void}) {
  const [current,setCurrent]=useState('');const [next,setNext]=useState('');const [confirm,setConfirm]=useState('');const [busy,setBusy]=useState(false);const [error,setError]=useState('');
  const submit=async(e:React.FormEvent)=>{e.preventDefault();if(busy)return;setError('');if(next!==confirm){setError('Your new passwords do not match.');return;}setBusy(true);try{const result=await api<{user:LoginUser}>('/auth/password','POST',{currentPassword:current,newPassword:next});setCurrent('');setNext('');setConfirm('');onChanged(result.user);}catch(e){setError(e instanceof Error?e.message:'Unable to change password.');}finally{setBusy(false);}};
  return <form onSubmit={submit} className="space-y-4">
    <div><h2 className="text-xl font-bold">{user.mustChangePassword?'Choose your own password':'Change password'}</h2><p className="text-sm text-slate-600 mt-2">{user.mustChangePassword?'Replace your temporary password before opening your workspace.':'Changing your password signs out your other sessions.'}</p></div>
    {error&&<p role="alert" className="text-sm text-rose-700 bg-rose-50 rounded-lg p-3">{error}</p>}
    <div><label className="auth-label" htmlFor="password-current">{user.mustChangePassword?'Temporary password':'Current password'}</label><input id="password-current" className="auth-input" type="password" autoComplete="current-password" required value={current} onChange={e=>setCurrent(e.target.value)}/></div>
    <div><label className="auth-label" htmlFor="password-new">New password</label><input id="password-new" className="auth-input" type="password" autoComplete="new-password" required minLength={5} maxLength={128} value={next} onChange={e=>setNext(e.target.value)}/><p className="text-xs text-slate-500 mt-1">Use at least 5 characters.</p></div>
    <div><label className="auth-label" htmlFor="password-confirm">Confirm new password</label><input id="password-confirm" className="auth-input" type="password" autoComplete="new-password" required value={confirm} onChange={e=>setConfirm(e.target.value)}/></div>
    <div className="flex gap-2 justify-end">{onCancel&&<button type="button" onClick={onCancel} className="auth-secondary">Cancel</button>}<button disabled={busy} className="auth-primary">{busy?'Saving…':'Save password'}</button></div>
  </form>;
}
