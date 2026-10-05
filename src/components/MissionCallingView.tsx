import React, { useState } from 'react';
import { 
  PhoneCall, 
  Users, 
  UserCheck, 
  Clock, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Search, 
  Filter, 
  ArrowRight, 
  TrendingUp, 
  Layers, 
  Download 
} from 'lucide-react';
import { CallingLead, ICLMember, CallStatus, PAWBatch } from '@/types/paw';
import { exportLeadsToCSV } from '@/lib/export-utils';
import { ImportLeadsModal } from '@/components/ImportLeadsModal';

interface MissionCallingViewProps {
  batch: PAWBatch;
  callingMembers: ICLMember[];
  leads: CallingLead[];
  onOpenCallLog: (lead: CallingLead) => void;
  onRegisterAndHandover: (lead: CallingLead) => void;
  onAddNewLead: (name: string, phone: string, city: string, memberId: string) => void;
  onBulkImportLeads?: (leads: Omit<CallingLead, 'id' | 'callLogs'>[]) => void;
}

export const MissionCallingView: React.FC<MissionCallingViewProps> = ({
  batch,
  callingMembers,
  leads,
  onOpenCallLog,
  onRegisterAndHandover,
  onAddNewLead,
  onBulkImportLeads,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedMember, setSelectedMember] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadCity, setNewLeadCity] = useState('Ahmedabad');
  const [newLeadMemberId, setNewLeadMemberId] = useState(callingMembers[0]?.id || '');


  // Filtered Leads
  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = selectedStatus === 'ALL' || lead.callStatus === selectedStatus;
    const matchesMember = selectedMember === 'ALL' || lead.assignedMemberId === selectedMember;
    const matchesSearch = 
      lead.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      lead.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesMember && matchesSearch;
  });

  // Calculate calling member capacity performance
  const memberStats = callingMembers.map((member) => {
    const memberLeads = leads.filter((l) => l.assignedMemberId === member.id);
    const capacity = member.callingCapacity || 25;
    const registeredCount = memberLeads.filter((l) => l.callStatus === 'REGISTERED').length;
    const calledCount = memberLeads.filter((l) => l.callStatus !== 'PENDING').length;
    const progressPercent = Math.min(100, Math.round((calledCount / capacity) * 100));

    return {
      member,
      capacity,
      allocated: memberLeads.length,
      calledCount,
      registeredCount,
      progressPercent,
    };
  });

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadPhone) return;
    onAddNewLead(newLeadName, newLeadPhone, newLeadCity, newLeadMemberId);
    setNewLeadName('');
    setNewLeadPhone('');
    setIsAddingLead(false);
  };

  const getStatusBadge = (status: CallStatus) => {
    switch (status) {
      case 'REGISTERED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Registered</span>;
      case 'INTERESTED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">Interested</span>;
      case 'CALLBACK_REQUESTED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">Callback</span>;
      case 'NOT_REACHABLE':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">Not Reachable</span>;
      case 'NOT_INTERESTED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">Not Interested</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">Pending</span>;
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Banner: Process & Hierarchy */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Mission PAW Calling Team
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Hierarchy: <span className="text-slate-700 font-medium">PAW Head → Leader Head → Leader → Calling Member</span>
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="font-semibold text-slate-800">Process:</span>
            <span>Data Allocate</span>
            <span className="text-slate-400">→</span>
            <span>Call</span>
            <span className="text-slate-400">→</span>
            <span>Follow-up</span>
            <span className="text-slate-400">→</span>
            <span className="text-emerald-700 font-medium">Registration</span>
          </div>
        </div>
      </div>

      {/* Calling Capacity Allocation Cards (15 / 25 / 35 Capacity) */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Calling Member Capacity & Progress (15 / 25 / 35 Calls)
          </h3>
          <span className="text-xs text-slate-500">
            Total Members: <strong className="text-slate-800">{callingMembers.length}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {memberStats.map(({ member, capacity, allocated, calledCount, registeredCount, progressPercent }) => (
            <div
              key={member.id}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{member.name}</h4>
                  <p className="text-xs text-slate-500">{member.phone}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  {capacity} Calls
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">Calls Done: {calledCount}/{allocated}</span>
                  <span className="text-blue-700 font-semibold">{progressPercent}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Member micro stats */}
              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100 text-center">
                  <span className="text-slate-500 block text-[10px]">Registered</span>
                  <span className="text-emerald-700 font-bold">{registeredCount} members</span>
                </div>
                <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100 text-center">
                  <span className="text-slate-500 block text-[10px]">Pending</span>
                  <span className="text-slate-700 font-bold">{allocated - calledCount} left</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leads Controls & Filters */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search name, phone or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {/* Filter by Member */}
            <select
              aria-label="Filter by Calling Member"
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">All Calling Members</option>
              {callingMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.callingCapacity} Cap)
                </option>
              ))}
            </select>

            {/* Export Leads button */}
            <button
              onClick={() => exportLeadsToCSV(filteredLeads, callingMembers, batch.name)}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200 flex items-center gap-1.5 transition whitespace-nowrap"
              title="Export filtered leads to CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>

            {/* Import Leads button */}
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200 flex items-center gap-1.5 transition whitespace-nowrap"
              title="Bulk import leads from CSV / paste"
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Import Leads</span>
            </button>

            {/* Add New Lead button */}
            <button
              onClick={() => setIsAddingLead(!isAddingLead)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs transition whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Lead</span>
            </button>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'ALL', label: 'All', count: leads.length },
            { id: 'PENDING', label: 'Pending', count: leads.filter((l) => l.callStatus === 'PENDING').length },
            { id: 'INTERESTED', label: 'Interested', count: leads.filter((l) => l.callStatus === 'INTERESTED').length },
            { id: 'CALLBACK_REQUESTED', label: 'Callback', count: leads.filter((l) => l.callStatus === 'CALLBACK_REQUESTED').length },
            { id: 'REGISTERED', label: 'Registered', count: leads.filter((l) => l.callStatus === 'REGISTERED').length },
            { id: 'NOT_REACHABLE', label: 'Not Reachable', count: leads.filter((l) => l.callStatus === 'NOT_REACHABLE').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-1 rounded-md font-medium transition whitespace-nowrap ${
                selectedStatus === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Add Lead Inline Drawer / Form */}
      {isAddingLead && (
        <form onSubmit={handleCreateLead} className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-slate-900">Add New Participant Contact Lead:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ketan Mehta"
                value={newLeadName}
                onChange={(e) => setNewLeadName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Mobile Number *</label>
              <input
                type="text"
                required
                placeholder="+91 98250 12345"
                value={newLeadPhone}
                onChange={(e) => setNewLeadPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">City</label>
              <input
                type="text"
                value={newLeadCity}
                onChange={(e) => setNewLeadCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-600 mb-1">Assign Calling Member</label>
              <select
                value={newLeadMemberId}
                onChange={(e) => setNewLeadMemberId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {callingMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.callingCapacity} Cap)
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingLead(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Save Lead
            </button>
          </div>
        </form>
      )}

      {/* Leads Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Participant Name</th>
                <th className="py-3 px-4 font-semibold">Mobile & City</th>
                <th className="py-3 px-4 font-semibold">Assigned Member</th>
                <th className="py-3 px-4 font-semibold">Call Status</th>
                <th className="py-3 px-4 font-semibold">Last Discussion Remark</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No leads found. Adjust your filter or add a new lead.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const assignedMember = callingMembers.find((m) => m.id === lead.assignedMemberId);
                  const latestLog = lead.callLogs?.[0];

                  return (
                    <tr key={lead.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{lead.fullName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">ID: {lead.id}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-mono text-slate-800">{lead.phone}</div>
                        <div className="text-[11px] text-slate-500">{lead.city}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-800 font-medium">{assignedMember?.name || '-'}</div>
                        <span className="text-[10px] text-slate-500">
                          {assignedMember?.callingCapacity} Calls Cap
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(lead.callStatus)}
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        {latestLog ? (
                          <div>
                            <p className="text-[11px] text-slate-700 truncate" title={latestLog.note}>
                              {latestLog.note}
                            </p>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {latestLog.timestamp}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No call logged yet</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* Dial */}
                          <a
                            href={`tel:${lead.phone}`}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                            title="Call Participant"
                          >
                            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                          </a>

                          {/* WhatsApp */}
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `Hello ${lead.fullName}, this is regarding your registration for the Personality Awareness Workshop (PAW) - ${batch.name}.`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition"
                            title="Send WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>

                          {/* Log Call */}
                          <button
                            onClick={() => onOpenCallLog(lead)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition"
                          >
                            Log Call
                          </button>

                          {/* Register & Handover */}
                          {lead.callStatus !== 'REGISTERED' && (
                            <button
                              onClick={() => onRegisterAndHandover(lead)}
                              className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[11px] font-semibold transition"
                              title="Register & Handover to Welcome Team"
                            >
                              Register
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Import Leads Modal */}
      {isImportModalOpen && onBulkImportLeads && (
        <ImportLeadsModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          callingMembers={callingMembers}
          batchId={batch.id}
          onImportLeads={onBulkImportLeads}
        />
      )}
    </div>
  );
};

