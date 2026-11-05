import { LogOut, Users, KeyRound } from 'lucide-react';
import { roleLabels, type LoginUser } from '@/lib/api';
export function AccountToolbar({user,onAccounts,onLogout,saveStatus,onImport}: {user:LoginUser;onAccounts:()=>void;onLogout:()=>void;saveStatus:string;onImport?:()=>void}) {
  return <div className="profile-sessionbar no-print"><div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
    <div className="min-w-0 flex flex-wrap items-center gap-x-3 gap-y-1"><span className="font-semibold break-all">{user.name}</span>{user.name!==roleLabels[user.role]&&<span className="text-slate-500">{roleLabels[user.role]}</span>}<span role="status" className={saveStatus==='error'?'text-rose-700':'text-slate-500'}>{saveStatus==='saving'?'Saving changes…':saveStatus==='error'?'Changes need attention':'All changes saved'}</span></div>
    <div className="flex flex-wrap items-center gap-2">{onImport&&<button onClick={onImport} className="rounded-lg px-2.5 py-1.5 hover:bg-slate-100 underline">Import saved browser records</button>}<button onClick={onAccounts} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 hover:bg-slate-100">{user.role==='PAW_HEAD'?<Users size={15}/>:<KeyRound size={15}/>}<span>{user.role==='PAW_HEAD'?'Manage logins':'My account'}</span></button><button onClick={onLogout} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 hover:bg-slate-100"><LogOut size={15}/><span>Sign out</span></button></div>
  </div></div>;
}
