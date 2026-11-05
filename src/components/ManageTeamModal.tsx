import { roleLabels } from '@/lib/api';
import { useDialog } from '@/lib/use-dialog';
import React, { useState } from 'react';
import { X, Users, UserPlus, Trash2, CheckCircle2, Shield } from 'lucide-react';
import { ICLMember, UserRole, CallingCapacity } from '@/types/paw';

interface ManageTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: ICLMember[];
  onAddMember: (member: ICLMember) => void;
  onToggleAvailability: (memberId: string) => void;
  onDeleteMember: (memberId: string) => void;
}

const ManageTeamModalContent: React.FC<ManageTeamModalProps> = ({
  isOpen,
  onClose,
  members,
  onAddMember,
  onToggleAvailability,
  onDeleteMember,
}) => {
  const dialogRef = useDialog(onClose);
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'CALLING' | 'WELCOME_FOLLOWUP'>('CALLING');
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('CALLING_MEMBER');
  const [parentLeaderId,setParentLeaderId]=useState('');
  const [capacity, setCapacity] = useState<CallingCapacity>(25);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newMember: ICLMember = {
      id: `m-${crypto.randomUUID()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      role,
      team: role === 'CALLING_MEMBER' ? 'CALLING' : role === 'WELCOME_MEMBER' ? 'WELCOME_FOLLOWUP' : 'LEADERSHIP',
      callingCapacity: role === 'CALLING_MEMBER' ? capacity : undefined,
      isAvailable: true,
      parentLeaderId:parentLeaderId||undefined,
    };

    onAddMember(newMember);
    setName('');
    setPhone('');
    setEmail('');
    setIsAdding(false);
  };

  const filteredMembers = members.filter((m) => {
    if (activeTab === 'CALLING') return m.team === 'CALLING';
    return m.team === 'WELCOME_FOLLOWUP' || m.team === 'LEADERSHIP';
  });

  return (
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="manage-team-title" tabIndex={-1} className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-5 my-4">
        {/* Header */}
        <div className="flex flex-nowrap items-start justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 shrink-0 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 id="manage-team-title" className="text-sm font-bold text-slate-900">
                Manage ICL Team & Roles
              </h2>
              <p className="text-[11px] text-slate-500">
                Configure Calling Team (15/25/35 capacity) and Welcome & Follow-up Team
              </p>
            </div>
          </div>
          <button
            aria-label="Close team management" onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher & Add Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setActiveTab('CALLING')}
              aria-pressed={activeTab==='CALLING'}
              className={`px-3 py-1 rounded-md font-medium transition ${
                activeTab === 'CALLING'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mission Calling Team ({members.filter(m => m.team === 'CALLING').length})
            </button>
            <button
              onClick={() => setActiveTab('WELCOME_FOLLOWUP')}
              aria-pressed={activeTab==='WELCOME_FOLLOWUP'}
              className={`px-3 py-1 rounded-md font-medium transition ${
                activeTab === 'WELCOME_FOLLOWUP'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Welcome & Follow-up Team ({members.filter(m => m.team === 'WELCOME_FOLLOWUP').length})
            </button>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center gap-1.5 transition shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Member</span>
          </button>
        </div>

        {/* Add Member Form */}
        {isAdding && (
          <form onSubmit={handleAddSubmit} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
            <h4 className="font-bold text-slate-900">Add New ICL Team Member</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Phone Number:</label>
                <input
                  type="tel"
                  placeholder="10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Assigned Role:</label>
                <select
                  value={role}
                  onChange={(e) => {setRole(e.target.value as UserRole);setParentLeaderId('');}}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="PAW_HEAD">PAW Head</option>
                  <option value="CALLING_MEMBER">Calling Member (Mission Calling)</option>
                  <option value="WELCOME_MEMBER">Welcome & Follow-up Member</option>
                  <option value="LEADER">Team Leader</option>
                  <option value="LEADER_HEAD">Leader Head</option>
                </select>
              </div>

              {role!=='PAW_HEAD'&&<div><label className="font-semibold text-slate-700 block mb-1" htmlFor="team-parent">Reports to</label><select id="team-parent" className="auth-input" value={parentLeaderId} onChange={e=>setParentLeaderId(e.target.value)}><option value="">Assign hierarchy later</option>{members.filter(m=>m.role===(role==='LEADER_HEAD'?'PAW_HEAD':role==='LEADER'?'LEADER_HEAD':'LEADER')).map(m=><option key={m.id} value={m.id}>{m.name}</option>)}</select></div>}
              {role === 'CALLING_MEMBER' && (
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Calling Capacity:</label>
                  <select
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value) as CallingCapacity)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value={15}>15 Calls Capacity</option>
                    <option value={25}>25 Calls Capacity</option>
                    <option value={35}>35 Calls Capacity</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
              >
                Save Member
              </button>
            </div>
          </form>
        )}

        <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 text-xs" aria-label="Team roster">
          {filteredMembers.length===0&&<li className="p-4 text-slate-600">No members in this team yet.</li>}
          {filteredMembers.map(m=>(
            <li key={m.id} className="flex flex-wrap items-center justify-between gap-3 p-3">
              <div className="min-w-0 [overflow-wrap:anywhere]">
                <strong className="block text-sm text-slate-900">{m.name}</strong>
                <p className="mt-1 text-slate-600">{roleLabels[m.role]}</p>
                {m.email&&<p className="mt-1 text-slate-600">{m.email}</p>}
                {m.phone&&<p className="mt-1 text-slate-600">{m.phone}</p>}
                {activeTab==='CALLING'&&<p className="mt-1 text-slate-600">Capacity · {m.callingCapacity||25} calls</p>}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={()=>onToggleAvailability(m.id)}
                  aria-label={`${m.name} is ${m.isAvailable?'active. Set inactive':'inactive. Set active'}`}
                  className={`min-h-9 rounded-lg border px-2.5 font-semibold ${m.isAvailable?'border-emerald-200 bg-emerald-50 text-emerald-700':'border-slate-200 bg-slate-100 text-slate-700'}`}
                >
                  {m.isAvailable?'Active':'Inactive'}
                </button>
                <button
                  onClick={()=>{if(confirm(`Remove ${m.name} from the team roster?`))onDeleteMember(m.id);}}
                  aria-label={`Remove ${m.name}`}
                  className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-slate-200 px-2.5 text-slate-700 hover:border-rose-200 hover:text-rose-700"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true"/> Remove
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500">
            Total active members: <strong>{filteredMembers.filter(m => m.isAvailable).length}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export const ManageTeamModal: React.FC<ManageTeamModalProps> = (props) => {
  if (!props.isOpen) return null;
  return <ManageTeamModalContent {...props} />;
};
