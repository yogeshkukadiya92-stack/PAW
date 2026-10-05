import React, { useState } from 'react';
import { X, Upload, Users, Check, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { ICLMember, CallingLead } from '@/types/paw';

interface ImportLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  callingMembers: ICLMember[];
  batchId: string;
  onImportLeads: (leads: Omit<CallingLead, 'id' | 'callLogs'>[]) => void;
}

export const ImportLeadsModal: React.FC<ImportLeadsModalProps> = ({
  isOpen,
  onClose,
  callingMembers,
  batchId,
  onImportLeads,
}) => {
  if (!isOpen) return null;

  const [rawText, setRawText] = useState('');
  const [allocationMode, setAllocationMode] = useState<'AUTO' | 'SPECIFIC'>('AUTO');
  const [selectedMemberId, setSelectedMemberId] = useState<string>(callingMembers[0]?.id || '');
  const [error, setError] = useState<string | null>(null);

  const sampleTemplate = `Rajesh Patel, 9825012345, Ahmedabad
Meera Shah, 9879023456, Surat
Vikram Desai, 9426034567, Vadodara
Anjali Mehta, 9909045678, Rajkot
Karan Joshi, 9824056789, Bhavnagar`;

  const handlePasteSample = () => {
    setRawText(sampleTemplate);
    setError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setRawText(text);
        setError(null);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!rawText.trim()) {
      setError('Please paste lead contacts or upload a CSV file.');
      return;
    }

    const lines = rawText.split('\n').filter(line => line.trim().length > 0);
    const parsedLeads: { fullName: string; phone: string; city: string }[] = [];

    lines.forEach((line) => {
      // Split by comma or tab
      const parts = line.split(/[,\t]/).map(p => p.trim());
      if (parts.length >= 2) {
        const name = parts[0];
        const phone = parts[1].replace(/[^0-9]/g, '');
        const city = parts[2] || 'Gujarat';
        if (name && phone.length >= 10) {
          parsedLeads.push({ fullName: name, phone, city });
        }
      }
    });

    if (parsedLeads.length === 0) {
      setError('Could not parse any valid contacts. Format should be: Name, 10-digit Phone, City');
      return;
    }

    // Allocate leads
    const preparedLeads: Omit<CallingLead, 'id' | 'callLogs'>[] = [];

    if (allocationMode === 'SPECIFIC' && selectedMemberId) {
      parsedLeads.forEach((lead) => {
        preparedLeads.push({
          pawBatchId: batchId,
          fullName: lead.fullName,
          phone: lead.phone,
          city: lead.city,
          assignedMemberId: selectedMemberId,
          callStatus: 'PENDING',
        });
      });
    } else {
      // Auto-Distribute by Capacity (15, 25, 35)
      const membersPool = callingMembers.filter(m => m.isAvailable);
      if (membersPool.length === 0) {
        setError('No available calling members found to distribute leads.');
        return;
      }

      parsedLeads.forEach((lead, idx) => {
        const assignedMember = membersPool[idx % membersPool.length];
        preparedLeads.push({
          pawBatchId: batchId,
          fullName: lead.fullName,
          phone: lead.phone,
          city: lead.city,
          assignedMemberId: assignedMember.id,
          callStatus: 'PENDING',
        });
      });
    }

    onImportLeads(preparedLeads);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-xl p-6 space-y-5 my-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Bulk Import Mission Calling Leads
              </h3>
              <p className="text-[11px] text-slate-500">
                Import contacts and automatically distribute by member capacity (15 / 25 / 35)
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

        {/* Allocation Mode Selector */}
        <div className="space-y-1.5 text-xs">
          <label className="font-semibold text-slate-700 block">
            Lead Allocation Mode:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label
              className={`p-3 rounded-xl border cursor-pointer flex items-start space-x-2.5 transition ${
                allocationMode === 'AUTO'
                  ? 'bg-blue-50 border-blue-400 text-blue-950 font-medium'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="allocationMode"
                checked={allocationMode === 'AUTO'}
                onChange={() => setAllocationMode('AUTO')}
                className="mt-0.5 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <strong className="block text-slate-900 text-xs">Auto-Distribute by Capacity</strong>
                <span className="text-[11px] text-slate-500">
                  Balances leads across active calling members (15 / 25 / 35 limits)
                </span>
              </div>
            </label>

            <label
              className={`p-3 rounded-xl border cursor-pointer flex items-start space-x-2.5 transition ${
                allocationMode === 'SPECIFIC'
                  ? 'bg-blue-50 border-blue-400 text-blue-950 font-medium'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="allocationMode"
                checked={allocationMode === 'SPECIFIC'}
                onChange={() => setAllocationMode('SPECIFIC')}
                className="mt-0.5 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <strong className="block text-slate-900 text-xs">Assign to Specific Member</strong>
                <span className="text-[11px] text-slate-500">
                  Assign all imported leads to one calling member
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Member Selector if Specific */}
        {allocationMode === 'SPECIFIC' && (
          <div className="space-y-1 text-xs">
            <label className="font-semibold text-slate-700 block">Select Calling Member:</label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
            >
              {callingMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — Capacity: {m.callingCapacity} calls
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Input Text Area / CSV */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-700">
              Paste Contacts (Format: Full Name, Phone, City):
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handlePasteSample}
                className="text-[11px] text-blue-600 hover:underline"
              >
                Insert 5 Sample Leads
              </button>
              <label className="cursor-pointer text-[11px] text-slate-600 hover:text-slate-900 underline flex items-center gap-1">
                <Upload className="w-3 h-3" />
                <span>Upload CSV</span>
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <textarea
            rows={6}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Kishore Patel, 9825012345, Ahmedabad&#10;Pooja Shah, 9879012345, Surat&#10;Amit Joshi, 9426012345, Vadodara"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleImport}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs transition flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Import & Allocate Leads</span>
          </button>
        </div>
      </div>
    </div>
  );
};
