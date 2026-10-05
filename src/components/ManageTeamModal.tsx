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

export const ManageTeamModal: React.FC<ManageTeamModalProps> = ({
  isOpen,
  onClose,
  members,
  onAddMember,
  onToggleAvailability,
  onDeleteMember,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'CALLING' | 'WELCOME_FOLLOWUP'>('CALLING');
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('CALLING_MEMBER');
  const [capacity, setCapacity] = useState<CallingCapacity>(25);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newMember: ICLMember = {
      id: `m-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim() || '9898012345',
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@cfl.in`,
      role,
      team: role === 'CALLING_MEMBER' ? 'CALLING' : 'WELCOME_FOLLOWUP',
      callingCapacity: role === 'CALLING_MEMBER' ? capacity : undefined,
      isAvailable: true,
    };

    onAddMember(newMember);
    setName('');
    setPhone('');
    setEmail('');
    setIsAdding(false);
  };

  const filteredMembers = members.filter((m) => {
    if (activeTab === 'CALLING') return m.team === 'CALLING';
    return m.team === 'WELCOME_FOLLOWUP';
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-5 my-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Manage ICL Team & Roles
              </h3>
              <p className="text-[11px] text-slate-500">
                Configure Calling Team (15/25/35 capacity) and Welcome & Follow-up Team
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
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
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="CALLING_MEMBER">Calling Member (Mission Calling)</option>
                  <option value="WELCOME_MEMBER">Welcome & Follow-up Member</option>
                  <option value="LEADER">Team Leader</option>
                  <option value="LEADER_HEAD">Leader Head</option>
                </select>
              </div>

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

        {/* Members Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Member Name</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Phone</th>
                {activeTab === 'CALLING' && <th className="py-2.5 px-3 text-center">Capacity</th>}
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3">
                    <strong className="text-slate-900 block">{m.name}</strong>
                    <span className="text-[11px] text-slate-400">{m.email}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {m.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">
                    {m.phone}
                  </td>
                  {activeTab === 'CALLING' && (
                    <td className="py-2.5 px-3 text-center">
                      <span className="font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {m.callingCapacity || 25} Calls
                      </span>
                    </td>
                  )}
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => onToggleAvailability(m.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition ${
                        m.isAvailable
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {m.isAvailable ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => {
                        if (confirm(`Remove ${m.name} from the team roster?`)) {
                          onDeleteMember(m.id);
                        }
                      }}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Remove member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
