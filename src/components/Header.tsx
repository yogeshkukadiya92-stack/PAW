import React from 'react';
import { 
  Calendar, 
  MapPin, 
  Video, 
  Users, 
  PhoneCall, 
  CheckCircle2, 
  Plus, 
  ShieldAlert,
  GraduationCap,
  ChevronDown
} from 'lucide-react';
import { PAWBatch, UserRole } from '@/types/paw';
import { formatDate, getDaysRemaining } from '@/lib/utils';

interface HeaderProps {
  allowNavigation?: boolean;
  canCreateBatch?: boolean;
  onEditBatch?:()=>void;
  canUseEscalations?: boolean;
  batches: PAWBatch[];
  selectedBatch: PAWBatch;
  onSelectBatch: (batch: PAWBatch) => void;
  onOpenNewBatchModal: () => void;
  onOpenManageTeamModal?: () => void;
  currentRole: UserRole | 'PARTICIPANT_VIEW';
  onRoleChange: (role: UserRole | 'PARTICIPANT_VIEW') => void;
  stats: {
    totalLeads: number;
    registered: number;
    welcomeCompleted: number;
    assignmentsDone: number;
    escalationsCount: number;
  };
  onOpenEscalations: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  allowNavigation = true,
  canCreateBatch = true,
  onEditBatch,
  canUseEscalations = true,
  batches,
  selectedBatch,
  onSelectBatch,
  onOpenNewBatchModal,
  onOpenManageTeamModal,
  currentRole,
  onRoleChange,
  stats,
  onOpenEscalations,
}) => {
  const daysUntilWelcome = getDaysRemaining(selectedBatch.welcomeStartDate);

  return (
    <header className="profile-workshop-controls w-full bg-white">
      <div className="w-full">
        {/* Top Bar: Brand, Batch Selector, Role Switcher */}
        <div className="flex items-center justify-between flex-wrap py-3 gap-3">
          <div><h2>Workshop operations</h2><p className="profile-muted text-xs mt-1">Manage your selected workshop and team.</p></div>

          {/* Batch Selector Dropdown */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <select
                aria-label="Select PAW Batch"
                value={selectedBatch.id}
                onChange={(e) => {
                  const b = batches.find((item) => item.id === e.target.value);
                  if (b) onSelectBatch(b);
                }}
                className="max-w-[180px] sm:max-w-none appearance-none bg-slate-50 text-slate-800 text-xs sm:text-sm pl-3 pr-8 py-1.5 rounded-lg border border-slate-300 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer font-medium"
              >
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.type})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {canCreateBatch && <button
              onClick={onOpenNewBatchModal}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition"
              aria-label="Create new workshop" title="Create New PAW"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New PAW</span>
            </button>}

            {onEditBatch&&<button className="profile-button" onClick={onEditBatch}>Edit workshop</button>}
            {onOpenManageTeamModal && (
              <button
                onClick={onOpenManageTeamModal}
                className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                aria-label="Manage team" title="Manage ICL Team & Capacities"
              >
                <Users className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">Team</span>
              </button>
            )}
          </div>

          {/* Workspace navigation */}
          <div className="flex items-center gap-2">
            {allowNavigation && <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => onRoleChange('PAW_HEAD')}
                className={`px-3 py-1 text-xs rounded-md font-medium transition ${
                  currentRole === 'PAW_HEAD'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => onRoleChange('CALLING_MEMBER')}
                className={`px-3 py-1 text-xs rounded-md font-medium transition ${
                  currentRole === 'CALLING_MEMBER' || currentRole === 'LEADER'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Calling Team
              </button>
              <button
                onClick={() => onRoleChange('WELCOME_MEMBER')}
                className={`px-3 py-1 text-xs rounded-md font-medium transition ${
                  currentRole === 'WELCOME_MEMBER'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Welcome & Follow-up
              </button>
              <button
                onClick={() => onRoleChange('PARTICIPANT_VIEW')}
                className={`flex items-center space-x-1 px-3 py-1 text-xs rounded-md font-medium transition ${
                  currentRole === 'PARTICIPANT_VIEW'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-blue-700 hover:text-blue-900'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>40-Q Portal</span>
              </button>
            </div>}

            {/* Escalations Bell/Button */}
            {canUseEscalations && stats.escalationsCount > 0 && (
              <button
                onClick={onOpenEscalations}
                className="relative p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition"
                title={`${stats.escalationsCount} Escalations Need Attention`}
              >
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-[10px] text-white font-bold flex items-center justify-center">
                  {stats.escalationsCount}
                </span>
              </button>
            )}
          </div>
        </div>

        {allowNavigation && <select aria-label="Select workspace view" value={currentRole} onChange={e => onRoleChange(e.target.value as UserRole | 'PARTICIPANT_VIEW')} className="md:hidden w-full mb-3 rounded-lg border border-slate-300 p-2 text-sm">
          <option value="PAW_HEAD">Overview</option>
          <option value="CALLING_MEMBER">Calling Team</option>
          <option value="WELCOME_MEMBER">Welcome & Follow-up</option>
          <option value="PARTICIPANT_VIEW">40-Q Portal</option>
        </select>}

        {/* Sub-Bar: Batch Countdown & Quick Indicators */}
        <div className="py-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-y-2 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>Workshop Dates: </span>
              <strong className="text-slate-900 font-medium">
                {formatDate(selectedBatch.startDate)} to {formatDate(selectedBatch.endDate)}
              </strong>
            </div>

            <div className="flex items-center space-x-1.5 text-slate-600">
              {selectedBatch.type === 'Online' ? (
                <Video className="w-3.5 h-3.5 text-blue-600" />
              ) : (
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              )}
              <span className="truncate max-w-xs">{selectedBatch.venueOrLink}</span>
            </div>

            <div className="hidden sm:flex items-center space-x-1.5 px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              <span>T-7 Welcome Calls: </span>
              <strong className="text-slate-900">{daysUntilWelcome > 0 ? `${daysUntilWelcome} Days Left` : 'Active'}</strong>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-500">Leads:</span>
              <span className="font-semibold text-slate-900">{stats.totalLeads}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-500">Registered:</span>
              <span className="font-semibold text-emerald-700">{stats.registered}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-500">Welcome Done:</span>
              <span className="font-semibold text-blue-700">{stats.welcomeCompleted}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
