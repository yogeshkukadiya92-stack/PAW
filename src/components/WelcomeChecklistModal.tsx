import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  PhoneCall, 
  MessageSquare, 
  Calendar, 
  FileText, 
  HelpCircle, 
  Share2, 
  Wrench, 
  ShieldAlert 
} from 'lucide-react';
import { Participant, WelcomeChecklist } from '@/types/paw';

interface WelcomeChecklistModalProps {
  participant: Participant | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveChecklist: (participantId: string, checklist: WelcomeChecklist, status: 'Completed' | 'Callback_Required' | 'Unreachable') => void;
  onEscalateToLeader: (participantId: string, reason: string) => void;
}

export const WelcomeChecklistModal: React.FC<WelcomeChecklistModalProps> = ({
  participant,
  isOpen,
  onClose,
  onSaveChecklist,
  onEscalateToLeader,
}) => {
  if (!isOpen || !participant) return null;

  const [checklist, setChecklist] = useState<WelcomeChecklist>({ ...participant.welcomeChecklist });
  const [callStatus, setCallStatus] = useState<'Completed' | 'Callback_Required' | 'Unreachable'>(
    participant.welcomeCallStatus === 'Pending' ? 'Completed' : participant.welcomeCallStatus
  );
  const [remarks, setRemarks] = useState(checklist.remarks || '');
  const [showEscalate, setShowEscalate] = useState(false);
  const [escalateReason, setEscalateReason] = useState('');

  const toggleItem = (key: keyof Omit<WelcomeChecklist, 'remarks'>) => {
    setChecklist((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveChecklist(participant.id, { ...checklist, remarks }, callStatus);
    onClose();
  };

  const handleEscalate = () => {
    if (!escalateReason) return;
    onEscalateToLeader(participant.id, escalateReason);
    setShowEscalate(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xl my-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-semibold text-blue-700">
              T-7 Welcome Call Process
            </span>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>{participant.fullName}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-100 font-mono text-slate-700">
                {participant.loginId}
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              {participant.phone} • Language: {participant.preferredLanguage.toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Contact & WhatsApp Group */}
        <div className="flex items-center gap-2 my-3">
          <a
            href={`tel:${participant.phone}`}
            className="flex-1 py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 flex items-center justify-center gap-1.5 transition"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
            <span>Welcome Call</span>
          </a>
          <a
            href={`https://wa.me/${participant.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
              `Hello ${participant.fullName}, this is your ICL Welcome Call follow-up for the PAW Workshop. Your Login ID is ${participant.loginId}.`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-xs font-medium text-emerald-700 border border-emerald-200 flex items-center justify-center gap-1.5 transition"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp Chat</span>
          </a>
        </div>

        <form onSubmit={handleSave} className="space-y-3.5">
          {/* Welcome Call 6-Point Structured Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                Welcome Call 6-Point Checklist
              </label>
              <span className="text-xs text-blue-700 font-medium">
                {Object.values(checklist).filter((v) => typeof v === 'boolean' && v).length} / 7 Completed
              </span>
            </div>

            <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              {/* 1. Verification */}
              <label className="flex items-start space-x-2.5 p-1.5 rounded-lg hover:bg-white cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={checklist.verified}
                  onChange={() => toggleItem('verified')}
                  className="mt-0.5 rounded text-blue-600 focus:ring-0 border-slate-300"
                />
                <div>
                  <strong className="text-slate-800 block">1. Participant Verification</strong>
                  <span className="text-slate-500 text-[11px]">Confirm participant full name, contact number, and registration status.</span>
                </div>
              </label>

              {/* 2. Date & Time */}
              <label className="flex items-start space-x-2.5 p-1.5 rounded-lg hover:bg-white cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={checklist.datesConfirmed}
                  onChange={() => toggleItem('datesConfirmed')}
                  className="mt-0.5 rounded text-blue-600 focus:ring-0 border-slate-300"
                />
                <div>
                  <strong className="text-slate-800 block">2. Workshop Date & Timing Confirmation</strong>
                  <span className="text-slate-500 text-[11px]">Walk through session dates, schedule, and venue/meeting link.</span>
                </div>
              </label>

              {/* 3. WhatsApp Group */}
              <label className="flex items-start space-x-2.5 p-1.5 rounded-lg hover:bg-white cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={checklist.whatsappConfirmed}
                  onChange={() => toggleItem('whatsappConfirmed')}
                  className="mt-0.5 rounded text-blue-600 focus:ring-0 border-slate-300"
                />
                <div>
                  <strong className="text-slate-800 block">3. WhatsApp Group Joining Verification</strong>
                  <span className="text-slate-500 text-[11px]">Ensure the participant is added to the official PAW WhatsApp group.</span>
                </div>
              </label>

              {/* 4. First Assignment */}
              <label className="flex items-start space-x-2.5 p-1.5 rounded-lg hover:bg-white cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={checklist.firstAssignmentGuided}
                  onChange={() => toggleItem('firstAssignmentGuided')}
                  className="mt-0.5 rounded text-blue-600 focus:ring-0 border-slate-300"
                />
                <div>
                  <strong className="text-slate-800 block">4. First Assignment (40 Questions) Guidance</strong>
                  <span className="text-slate-500 text-[11px]">Explain the goal of completing the 40 questions assessment before Day 1.</span>
                </div>
              </label>

              {/* 5. Tech Support */}
              <label className="flex items-start space-x-2.5 p-1.5 rounded-lg hover:bg-white cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={checklist.techSupportProvided}
                  onChange={() => toggleItem('techSupportProvided')}
                  className="mt-0.5 rounded text-blue-600 focus:ring-0 border-slate-300"
                />
                <div>
                  <strong className="text-slate-800 block">5. Login & Technical Support</strong>
                  <span className="text-slate-500 text-[11px]">Provide Login ID ({participant.loginId}) and answer technical questions.</span>
                </div>
              </label>

              {/* 6. Doubts Clear */}
              <label className="flex items-start space-x-2.5 p-1.5 rounded-lg hover:bg-white cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={checklist.doubtsCleared}
                  onChange={() => toggleItem('doubtsCleared')}
                  className="mt-0.5 rounded text-blue-600 focus:ring-0 border-slate-300"
                />
                <div>
                  <strong className="text-slate-800 block">6. Clarify Doubts & Build Confidence</strong>
                  <span className="text-slate-500 text-[11px]">Answer questions warmly and explain the workshop benefits.</span>
                </div>
              </label>

              {/* 7. Attendance Confirmation */}
              <label className="flex items-start space-x-2.5 p-1.5 rounded-lg hover:bg-white cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={checklist.attendanceConfirmed}
                  onChange={() => toggleItem('attendanceConfirmed')}
                  className="mt-0.5 rounded text-blue-600 focus:ring-0 border-slate-300"
                />
                <div>
                  <strong className="text-emerald-700 block font-semibold">7. 100% Attendance Commitment</strong>
                  <span className="text-slate-500 text-[11px]">Secure commitment to attend all multi-day sessions punctually.</span>
                </div>
              </label>
            </div>
          </div>

          {/* Status Dropdown & Escalation */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Welcome Call Status
              </label>
              <select
                value={callStatus}
                onChange={(e) => setCallStatus(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Completed">✓ Completed</option>
                <option value="Callback_Required">⏳ Callback Required</option>
                <option value="Unreachable">✕ Unreachable</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Leader Escalation
              </label>
              <button
                type="button"
                onClick={() => setShowEscalate(!showEscalate)}
                className="w-full py-2 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-medium text-xs flex items-center justify-center gap-1.5 transition"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                <span>Escalate to Leader</span>
              </button>
            </div>
          </div>

          {/* Escalation input box if toggled */}
          {showEscalate && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 space-y-2">
              <span className="text-xs font-semibold text-rose-800 block">
                Reason for Leader Escalation:
              </span>
              <input
                type="text"
                placeholder="e.g. Phone unreachable after 3 attempts..."
                value={escalateReason}
                onChange={(e) => setEscalateReason(e.target.value)}
                className="w-full bg-white border border-rose-300 rounded-md p-2 text-xs text-slate-800 focus:outline-none focus:border-rose-500"
              />
              <button
                type="button"
                onClick={handleEscalate}
                className="px-3 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition"
              >
                Escalate Now
              </button>
            </div>
          )}

          {/* Remarks */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Welcome Call Remarks & Notes
            </label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter discussion notes and observations..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition"
            >
              Save Checklist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
