import React, { useState } from 'react';
import { X, PhoneCall, Clock, CheckCircle2, MessageSquare, PhoneOff, Calendar } from 'lucide-react';
import { CallingLead, CallStatus } from '@/types/paw';

interface CallLogModalProps {
  lead: CallingLead | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveLog: (leadId: string, status: CallStatus, note: string, callbackDate?: string) => void;
  onRegisterAndHandover: (lead: CallingLead) => void;
}

export const CallLogModal: React.FC<CallLogModalProps> = ({
  lead,
  isOpen,
  onClose,
  onSaveLog,
  onRegisterAndHandover,
}) => {
  if (!isOpen || !lead) return null;

  const [status, setStatus] = useState<CallStatus>(lead.callStatus);
  const [note, setNote] = useState('');
  const [callbackDate, setCallbackDate] = useState(lead.nextFollowupDate || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'REGISTERED') {
      onRegisterAndHandover(lead);
    } else {
      onSaveLog(lead.id, status, note, callbackDate);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Call Log: {lead.fullName}
            </h3>
            <p className="text-xs text-slate-500">{lead.phone} • {lead.city}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Quick Call Actions */}
          <div className="flex gap-2">
            <a
              href={`tel:${lead.phone}`}
              className="flex-1 py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-700 flex items-center justify-center gap-1.5 transition"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span>Dial Phone</span>
            </a>
            <a
              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                `Hello ${lead.fullName}, this is regarding your inquiry for the Personality Awareness Workshop (PAW). Please let us know if you have any questions.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-xs font-medium text-emerald-700 border border-emerald-200 flex items-center justify-center gap-1.5 transition"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Message</span>
            </a>
          </div>

          {/* Call Outcome Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Call Outcome Status *
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setStatus('INTERESTED')}
                className={`p-2.5 rounded-lg border text-left font-medium transition ${
                  status === 'INTERESTED'
                    ? 'bg-amber-50 border-amber-300 text-amber-800 font-semibold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Interested
              </button>
              <button
                type="button"
                onClick={() => setStatus('CALLBACK_REQUESTED')}
                className={`p-2.5 rounded-lg border text-left font-medium transition ${
                  status === 'CALLBACK_REQUESTED'
                    ? 'bg-blue-50 border-blue-300 text-blue-800 font-semibold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Callback Requested
              </button>
              <button
                type="button"
                onClick={() => setStatus('NOT_REACHABLE')}
                className={`p-2.5 rounded-lg border text-left font-medium transition ${
                  status === 'NOT_REACHABLE'
                    ? 'bg-rose-50 border-rose-300 text-rose-800 font-semibold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Not Reachable
              </button>
              <button
                type="button"
                onClick={() => setStatus('REGISTERED')}
                className={`p-2.5 rounded-lg border text-left font-medium transition ${
                  status === 'REGISTERED'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Registered
              </button>
            </div>
          </div>

          {/* Callback Date if needed */}
          {status === 'CALLBACK_REQUESTED' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>Next Follow-up Date & Time</span>
              </label>
              <input
                type="datetime-local"
                value={callbackDate}
                onChange={(e) => setCallbackDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          {/* Call Notes / Remarks */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Discussion Notes / Remarks
            </label>
            <textarea
              rows={3}
              placeholder="Enter details of conversation..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Previous History */}
          {lead.callLogs && lead.callLogs.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-600">Past History:</span>
              <div className="mt-1 space-y-1 max-h-24 overflow-y-auto pr-1 text-xs">
                {lead.callLogs.map((log) => (
                  <div key={log.id} className="p-2 rounded bg-slate-50 text-[11px] text-slate-700 border border-slate-200">
                    <div className="flex justify-between font-mono text-[10px] text-slate-500 mb-0.5">
                      <span>{log.timestamp}</span>
                      <span className="font-semibold text-slate-800">{log.status}</span>
                    </div>
                    <p>{log.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Close
            </button>
            
            {status === 'REGISTERED' ? (
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm Registration & Handover</span>
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition"
              >
                Save Call Log
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
