import React from 'react';
import { X, Award, Printer } from 'lucide-react';
import { Participant, PAWBatch } from '@/types/paw';
import { formatDate } from '@/lib/utils';

interface CertificateModalProps {
  participant: Participant | null;
  batch: PAWBatch;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  participant,
  batch,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !participant) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xl my-6">
        {/* Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 print:hidden">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              PAW Completion Certificate
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Card Printable Area */}
        <div className="p-8 sm:p-10 my-3 bg-white border-4 border-double border-slate-300 rounded-xl relative shadow-xs text-center">
          {/* Badge */}
          <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-200 mx-auto mb-3 flex items-center justify-center">
            <Award className="w-7 h-7 text-blue-600" />
          </div>

          <span className="text-[11px] uppercase tracking-widest text-slate-500 font-bold block mb-1">
            CERTIFICATE OF COMPLETION
          </span>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif mb-1">
            Personality Awareness Workshop
          </h2>

          <p className="text-xs text-slate-500 max-w-md mx-auto mb-5">
            This is proudly presented to certify that the following participant has successfully completed the Personality Awareness Workshop (PAW):
          </p>

          <div className="my-5">
            <h3 className="text-2xl font-bold text-slate-900 pb-0.5">
              {participant.fullName}
            </h3>
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mt-1 font-mono">
              <span>ID: {participant.loginId}</span>
              <span>•</span>
              <span>Batch: {batch.code}</span>
              <span>•</span>
              <span>Mode: {batch.type}</span>
            </div>
          </div>

          {participant.personalityType && (
            <div className="inline-block px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium my-2">
              Identified Archetype: {participant.personalityType}
            </div>
          )}

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 mt-8 pt-6 border-t border-slate-200 text-xs text-slate-500">
            <div>
              <div className="font-serif italic text-slate-800 text-sm mb-1">Sanjay Patel</div>
              <strong className="block text-slate-800">PAW Head</strong>
              <span>ICL Foundation</span>
            </div>
            <div>
              <div className="font-mono text-slate-700 text-xs mb-1">{formatDate(batch.endDate)}</div>
              <strong className="block text-slate-800">Date of Award</strong>
              <span>Authorized Verification</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
