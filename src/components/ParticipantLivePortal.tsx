import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, ArrowRight, BookOpen, Search, Award } from 'lucide-react';
import { ASSESSMENT_LANGUAGES } from '@/lib/assessment-i18n';
import { participantReports } from '@/lib/assessment';
import type { Participant } from '@/types/paw';

interface ParticipantLivePortalProps {
  participants: Participant[];
  workshopName: string;
  onOpenAssessment: (participant: Participant) => void;
  onOpenCertificate: (participant: Participant) => void;
}

export const ParticipantLivePortal: React.FC<ParticipantLivePortalProps> = ({
  participants,
  workshopName,
  onOpenAssessment,
  onOpenCertificate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [matchedRecord, setMatchedParticipant] = useState<Participant | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const heading = resultHeading.current;
    if (!hasSearched || !heading) return;
    heading.focus({ preventScroll: true });
    heading.scrollIntoView({ block: 'start' });
  }, [hasSearched, matchedRecord]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setHasSearched(true);
    const cleanSearch = searchTerm.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

    const found = cleanSearch && participants.find((p) => {
      const matchPhone = p.phone.replace(/[^0-9]/g, '') === cleanSearch;
      const matchLogin = p.loginId.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanSearch;
      return matchPhone || matchLogin;
    });

    setMatchedParticipant(found || null);
  };

  const matchedParticipant = participants.find(p => p.id === matchedRecord?.id) || null;
  const language = matchedParticipant && (participantReports(matchedParticipant)[0]?.language || matchedParticipant.preferredLanguage);
  const languageLabel = ASSESSMENT_LANGUAGES.find(option => option.value === language)?.label;

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      {/* Hero Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center mx-auto">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-semibold text-blue-700 tracking-wider uppercase">
            Participant assessments
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            PAW Personality Profile Analysis & First Assignment
          </h2>
          <p className="text-xs text-slate-600 max-w-lg mx-auto mt-1.5 leading-relaxed">
            Find a registered participant to open their 40-question assessment or view their personality report.
          </p>
        </div>

        <form onSubmit={handleSearch} className="mx-auto max-w-md pt-2 text-left">
          <label htmlFor="portal-lookup">Registered mobile number or login ID</label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="portal-lookup"
              type="text"
              required
              autoCapitalize="none"
              spellCheck={false}
              placeholder="Mobile number or login ID"
              value={searchTerm}
              onChange={e=>{
                setSearchTerm(e.target.value);
                setHasSearched(false);
              }}
            />
            <button type="submit" className="profile-button primary shrink-0">
              <Search size={16} aria-hidden="true"/> Find participant
            </button>
          </div>
        </form>

        {/* Quick Participant Chips for Convenience */}
        {!!participants.length&&<div className="pt-2 text-center">
          <span className="text-[11px] text-slate-400 block mb-1.5">Or choose a participant below</span>
          <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-xl mx-auto">
            {participants.slice(0, 5).map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={hasSearched && matchedParticipant?.id === p.id}
                onClick={() => {
                  setMatchedParticipant(p);
                  setHasSearched(true);
                }}
                className="min-h-9 max-w-full [overflow-wrap:anywhere] px-2.5 py-1 rounded-lg text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium transition"
              >
                {p.fullName} ({p.loginId})
              </button>
            ))}
          </div>
        </div>}
      </div>

      {/* Matched Participant Result Card */}
      {hasSearched && matchedParticipant && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide">
                Participant Found
              </span>
              <h3 ref={resultHeading} tabIndex={-1} className="scroll-mt-8 text-base font-bold text-slate-900 mt-0.5 [overflow-wrap:anywhere]">
                {matchedParticipant.fullName}
              </h3>
              <p className="text-xs text-slate-500 font-mono [overflow-wrap:anywhere]">
                Login ID: {matchedParticipant.loginId} • Phone: {matchedParticipant.phone} • City: {matchedParticipant.city}
              </p>
            </div>

            <div className="flex flex-col items-start sm:items-end">
              <span className="text-[11px] text-slate-400">Assignment Status</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                matchedParticipant.firstAssignmentStatus === 'Report_Generated'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                {matchedParticipant.firstAssignmentStatus.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block mb-0.5">Workshop Batch:</span>
              <strong className="text-slate-800">{workshopName}</strong>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block mb-0.5">Assessment Language:</span>
              <strong className="text-slate-800">{languageLabel || 'Choose when starting'}</strong>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block mb-0.5">Personality Archetype:</span>
              <strong className="text-blue-700">
                {matchedParticipant.personalityType || 'Pending 40-Q Completion'}
              </strong>
            </div>
          </div>

          {/* Action Call to Action */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <h4 className="font-bold text-blue-950">
                {matchedParticipant.firstAssignmentStatus === 'Report_Generated'
                  ? 'Your Personality Profile Analysis Report is Ready'
                  : 'Ready to Begin Your 40 Questions?'}
              </h4>
              <p className="text-blue-900 text-[11px] mt-0.5">
                {matchedParticipant.firstAssignmentStatus === 'Report_Generated'
                  ? 'Review your dominant and secondary temperaments, score matrix, superpowers, and print your report.'
                  : 'Takes only 5-7 minutes. 20 Strengths and 20 Weaknesses questions based on Florence Littauer model.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenAssessment(matchedParticipant)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>
                  {matchedParticipant.firstAssignmentStatus === 'Report_Generated'
                    ? 'View Personality Report'
                    : 'Start Assessment'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {matchedParticipant.firstAssignmentStatus === 'Report_Generated' && (
                <button
                  type="button"
                  onClick={() => onOpenCertificate(matchedParticipant)}
                  className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-semibold text-xs transition flex items-center gap-1.5"
                  title="View Certificate"
                >
                  <Award className="w-4 h-4 text-purple-600" />
                  <span>Certificate</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {hasSearched && !matchedParticipant && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs text-center space-y-2">
          <h3 ref={resultHeading} tabIndex={-1} className="scroll-mt-8 text-sm font-semibold text-slate-800 [overflow-wrap:anywhere]">No participant found matching “{searchTerm}”</h3>
          <p className="text-xs text-slate-500">
            Please verify your 10-digit mobile number or Login ID with your assigned ICL Member or PAW Head.
          </p>
        </div>
      )}
    </div>
  );
};
