import React, { useState } from 'react';
import { X, UserPlus, Check, AlertCircle } from 'lucide-react';
import { ICLMember, Participant, PreferredLanguage } from '@/types/paw';

interface AddParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  welcomeMembers: ICLMember[];
  batchId: string;
  batchCode: string;
  existingCount: number;
  onAddParticipant: (participant: Participant) => void;
}

export const AddParticipantModal: React.FC<AddParticipantModalProps> = ({
  isOpen,
  onClose,
  welcomeMembers,
  batchId,
  batchCode,
  existingCount,
  onAddParticipant,
}) => {
  if (!isOpen) return null;

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<PreferredLanguage>('en');
  const [assignedMemberId, setAssignedMemberId] = useState<string>(welcomeMembers[0]?.id || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please enter the participant full name.');
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit WhatsApp/mobile number.');
      return;
    }

    const nextNumber = String(existingCount + 1).padStart(3, '0');
    const newParticipant: Participant = {
      id: `part-${Date.now()}`,
      loginId: `${batchCode || 'PAW'}-${nextNumber}`,
      pawBatchId: batchId,
      fullName: fullName.trim(),
      phone: cleanPhone,
      whatsappNumber: cleanPhone,
      preferredLanguage,
      city: city.trim() || 'Ahmedabad',
      registeredAt: new Date().toISOString().split('T')[0],
      registrationStatus: 'Confirmed',
      whatsappGroupJoined: false,
      assignedWelcomeIclMemberId: assignedMemberId || welcomeMembers[0]?.id,
      welcomeCallStatus: 'Pending',
      welcomeChecklist: {
        verified: false,
        datesConfirmed: false,
        whatsappConfirmed: false,
        firstAssignmentGuided: false,
        techSupportProvided: false,
        doubtsCleared: false,
        attendanceConfirmed: false,
        remarks: 'Direct registration. Welcome Call scheduled.',
      },
      firstAssignmentStatus: 'Not_Started',
      followups: [],
    };

    onAddParticipant(newParticipant);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-5 my-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Register New PAW Participant
              </h3>
              <p className="text-[11px] text-slate-500">
                Direct registration with 1:1 ICL member assignment continuity
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

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Full Name: <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Suresh Patel"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                WhatsApp / Phone: <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="10-digit number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                City:
              </label>
              <input
                type="text"
                placeholder="e.g. Ahmedabad, Surat"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Assigned ICL Member (1:1 Ownership):
              </label>
              <select
                value={assignedMemberId}
                onChange={(e) => setAssignedMemberId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              >
                {welcomeMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} (Welcome Team)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Preferred Language:
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value as PreferredLanguage)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="en">English (Official Coach For Life)</option>
                <option value="gu">Gujarati</option>
                <option value="hi">Hindi</option>
                <option value="mr">Marathi</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-[11px] leading-relaxed">
            <strong>1:1 Continuity Rule:</strong> This participant will be permanently assigned to the selected ICL Member for the T-7 Welcome Call, First Assignment guidance, and all 3 days of workshop sessions.
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Confirm Registration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
