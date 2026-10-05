import React from 'react';
import { X, ShieldAlert, PhoneCall, CheckCircle2 } from 'lucide-react';
import { Participant, ICLMember } from '@/types/paw';

interface EscalationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  escalatedParticipants: Participant[];
  welcomeMembers: ICLMember[];
  onResolveEscalation: (participantId: string) => void;
}

export const EscalationDrawer: React.FC<EscalationDrawerProps> = ({
  isOpen,
  onClose,
  escalatedParticipants,
  welcomeMembers,
  onResolveEscalation,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-xs">
      <div className="relative w-full max-w-md h-full bg-white border-l border-slate-200 p-6 shadow-2xl overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Leader Escalation Hub
              </h3>
              <p className="text-xs text-rose-700">
                {escalatedParticipants.length} Participants Need Attention
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {escalatedParticipants.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2 opacity-80" />
              <p>No active escalations pending.</p>
            </div>
          ) : (
            escalatedParticipants.map((p) => {
              const assignedMember = welcomeMembers.find((m) => m.id === p.assignedWelcomeIclMemberId);
              const latestEscalation = p.followups.find((f) => f.escalatedToLeader);

              return (
                <div
                  key={p.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{p.fullName}</h4>
                      <p className="text-xs text-slate-500">
                        {p.phone} • {p.city}
                      </p>
                    </div>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                      {p.loginId}
                    </span>
                  </div>

                  <div className="bg-rose-50 p-2.5 rounded-lg border border-rose-200 text-xs text-rose-900">
                    <span className="font-semibold block text-[10px] text-rose-700 mb-0.5 uppercase">
                      Escalation Reason:
                    </span>
                    <p>{latestEscalation?.iclRemark || p.welcomeChecklist.remarks || 'No response to calls.'}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span>
                      Assigned ICL: <strong className="text-slate-700">{assignedMember?.name}</strong>
                    </span>
                    <span>WA Group: {p.whatsappGroupJoined ? 'Joined ✓' : 'Pending —'}</span>
                  </div>

                  <div className="flex items-center space-x-2 pt-2 border-t border-slate-200">
                    <a
                      href={`tel:${p.phone}`}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center justify-center gap-1.5 transition"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Leader Call</span>
                    </a>

                    <button
                      onClick={() => onResolveEscalation(p.id)}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold transition flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Resolve</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
