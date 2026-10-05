import React, { useState } from 'react';
import { 
  Users, 
  PhoneCall, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  BookOpen, 
  ShieldAlert, 
  Sparkles, 
  Award, 
  Search, 
  Check, 
  UserCheck, 
  Download, 
  CalendarCheck,
  UserPlus 
} from 'lucide-react';
import { Participant, ICLMember, PAWBatch, AssignmentStatus } from '@/types/paw';
import { exportParticipantsToCSV } from '@/lib/export-utils';
import { AddParticipantModal } from '@/components/AddParticipantModal';

interface WelcomeFollowupViewProps {
  batch: PAWBatch;
  welcomeMembers: ICLMember[];
  participants: Participant[];
  onOpenChecklistModal: (participant: Participant) => void;
  onOpenParticipantPortal: (participant: Participant) => void;
  onOpenCertificateModal: (participant: Participant) => void;
  onToggleWhatsAppJoined: (participantId: string) => void;
  onToggleSessionAttendance: (participantId: string, sessionIndex: number) => void;
  onAddParticipant?: (participant: Participant) => void;
}

export const WelcomeFollowupView: React.FC<WelcomeFollowupViewProps> = ({
  batch,
  welcomeMembers,
  participants,
  onOpenChecklistModal,
  onOpenParticipantPortal,
  onOpenCertificateModal,
  onToggleWhatsAppJoined,
  onToggleSessionAttendance,
  onAddParticipant,
}) => {
  const [selectedMember, setSelectedMember] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'WELCOME' | 'ASSIGNMENTS' | 'ATTENDANCE'>('WELCOME');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false);

  const filteredParticipants = participants.filter((p) => {
    const matchesMember = selectedMember === 'ALL' || p.assignedWelcomeIclMemberId === selectedMember;
    const matchesSearch = 
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.loginId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery);
    return matchesMember && matchesSearch;
  });

  const getAssignmentBadge = (status: AssignmentStatus) => {
    switch (status) {
      case 'Report_Generated':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Report Done
          </span>
        );
      case 'Submitted':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            40-Q Submitted
          </span>
        );
      case 'In_Progress':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            In Progress
          </span>
        );
      case 'Basic_Completed':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            Basic Details Done
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
            Not Started
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* 1:1 Ownership Golden Rule Banner */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                Welcome & Follow-up ICL Team (Unified Team)
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                1:1 Continuity
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              <strong>Core Rule:</strong> The same ICL Member who conducts the Welcome Call will follow up with the participant on assignments and sessions throughout the workshop.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportParticipantsToCSV(participants, welcomeMembers, batch.name)}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200 flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setIsAddParticipantOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-1.5 transition shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Participant</span>
            </button>
          </div>
        </div>
      </div>

      {/* View Tabs & Filters */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Main Action Tabs */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('WELCOME')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'WELCOME'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5 text-slate-500" />
              <span>Welcome Calls ({participants.filter(p => p.welcomeCallStatus === 'Completed').length}/{participants.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('ASSIGNMENTS')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'ASSIGNMENTS'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>40-Q Assignments ({participants.filter(p => p.firstAssignmentStatus === 'Report_Generated' || p.firstAssignmentStatus === 'Submitted').length}/{participants.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('ATTENDANCE')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'ATTENDANCE'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Live Attendance (Day 1-3)</span>
            </button>
          </div>

          {/* Search & Member Filter */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name or Login ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <select
              aria-label="Filter by Assigned ICL Member"
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">All ICL Members</option>
              {welcomeMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Participants List */}
      <div className="grid grid-cols-1 gap-3">
        {filteredParticipants.length === 0 ? (
          <div className="bg-white p-8 text-center text-slate-400 rounded-xl border border-slate-200">
            No participants found.
          </div>
        ) : (
          filteredParticipants.map((p) => {
            const assignedMember = welcomeMembers.find((m) => m.id === p.assignedWelcomeIclMemberId);
            const checklistScore = Object.values(p.welcomeChecklist).filter((v) => typeof v === 'boolean' && v).length;
            const hasEscalation = p.followups.some((f) => f.escalatedToLeader);

            return (
              <div
                key={p.id}
                className={`bg-white p-4 rounded-xl border transition-all shadow-xs ${
                  hasEscalation
                    ? 'border-rose-300 bg-rose-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
                  {/* Left: Participant Info */}
                  <div className="flex items-start space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                      {p.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h4 className="text-sm font-bold text-slate-900">{p.fullName}</h4>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                          {p.loginId}
                        </span>
                        <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {p.preferredLanguage}
                        </span>
                        {hasEscalation && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3 text-rose-600" />
                            <span>Escalated</span>
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                        <span>📞 {p.phone}</span>
                        <span>📍 {p.city}</span>
                        <span>
                          Assigned ICL: <strong className="text-slate-800">{assignedMember?.name || 'Unassigned'}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Multi-Day Attendance Matrix OR Welcome Status */}
                  {activeTab === 'ATTENDANCE' ? (
                    <div className="flex items-center space-x-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200">
                      {[1, 2, 3].map((dayNum) => {
                        const attended = p.followups.some((f) => f.sessionNumber === dayNum && f.attended);
                        return (
                          <button
                            key={dayNum}
                            onClick={() => onToggleSessionAttendance(p.id, dayNum)}
                            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition ${
                              attended
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold'
                                : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <span>Day {dayNum}</span>
                            <span>{attended ? '✓' : '—'}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      {/* WhatsApp Group Toggle */}
                      <button
                        onClick={() => onToggleWhatsAppJoined(p.id)}
                        className={`px-2 py-1 rounded-md text-xs font-medium border flex items-center gap-1 transition ${
                          p.whatsappGroupJoined
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>{p.whatsappGroupJoined ? 'WA Group ✓' : 'WA Group —'}</span>
                      </button>

                      {/* Welcome Call Status */}
                      <button
                        onClick={() => onOpenChecklistModal(p)}
                        className={`px-2 py-1 rounded-md text-xs font-medium border flex items-center gap-1 transition ${
                          p.welcomeCallStatus === 'Completed'
                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                            : 'bg-amber-50 border-amber-200 text-amber-800'
                        }`}
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>
                          Welcome: {p.welcomeCallStatus === 'Completed' ? `Done (${checklistScore}/7)` : 'Pending'}
                        </span>
                      </button>

                      {/* Assignment Status */}
                      <div className="flex items-center gap-1.5">
                        {getAssignmentBadge(p.firstAssignmentStatus)}
                        {p.personalityType && (
                          <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-purple-50 text-purple-700 border border-purple-200 max-w-[140px] truncate" title={p.personalityType}>
                            {p.personalityType}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Right: Action Buttons */}
                  <div className="flex items-center space-x-1.5 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-2 lg:pt-0 border-slate-100">
                    <a
                      href={`tel:${p.phone}`}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      title="Direct Call"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                    </a>

                    <a
                      href={`https://wa.me/${p.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hello ${p.fullName}, this is regarding your PAW workshop follow-up. Your Login ID is ${p.loginId}.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition"
                      title="Direct WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => onOpenChecklistModal(p)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition"
                    >
                      Checklist
                    </button>

                    {/* 40-Q Portal Simulation */}
                    <button
                      onClick={() => onOpenParticipantPortal(p)}
                      className={`px-2.5 py-1.5 rounded-lg font-medium text-xs transition flex items-center gap-1 ${
                        p.firstAssignmentStatus === 'Report_Generated'
                          ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{p.firstAssignmentStatus === 'Report_Generated' ? 'View Report' : '40-Q Test'}</span>
                    </button>

                    {/* Certificate Button */}
                    {p.firstAssignmentStatus === 'Report_Generated' && (
                      <button
                        onClick={() => onOpenCertificateModal(p)}
                        className="px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-medium text-xs transition flex items-center gap-1"
                        title="View & Print Certificate"
                      >
                        <Award className="w-3.5 h-3.5 text-purple-600" />
                        <span>Certificate</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Remarks preview if present */}
                {p.welcomeChecklist.remarks && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                    <span className="italic truncate max-w-xl">
                      "{p.welcomeChecklist.remarks}"
                    </span>
                    {p.personalityType && (
                      <span className="text-[11px] font-medium text-slate-700">
                        {p.personalityType}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Participant Modal */}
      {isAddParticipantOpen && onAddParticipant && (
        <AddParticipantModal
          isOpen={isAddParticipantOpen}
          onClose={() => setIsAddParticipantOpen(false)}
          welcomeMembers={welcomeMembers}
          batchId={batch.id}
          batchCode={batch.code}
          existingCount={participants.length}
          onAddParticipant={onAddParticipant}
        />
      )}
    </div>
  );
};

