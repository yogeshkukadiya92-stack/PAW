import React, { useState, useMemo } from 'react';
import { 
  X, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Download, 
  Printer, 
  Sparkles, 
  User, 
  Phone, 
  Check, 
  ListChecks, 
  HelpCircle, 
  LayoutList, 
  Layers, 
  RotateCcw,
  Award,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Participant } from '@/types/paw';
import { 
  CFL_PAW_QUESTIONS, 
  TEMPERAMENT_PROFILES, 
  TemperamentType, 
  PAWQuestionOption 
} from '@/lib/cfl-questions-data';

interface ParticipantAssessmentModalProps {
  participant: Participant | null;
  isOpen: boolean;
  onClose: () => void;
  onCompleteAssessment: (
    participantId: string, 
    personalityType: string,
    answers?: Record<number, string>,
    scores?: Record<TemperamentType, { strengths: number; weaknesses: number; total: number }>,
    dominant?: TemperamentType,
    secondary?: TemperamentType
  ) => void;
  onSaveAnswersProgress?: (participantId: string, answers: Record<number, string>) => void;
}

export const ParticipantAssessmentModal: React.FC<ParticipantAssessmentModalProps> = ({
  participant,
  isOpen,
  onClose,
  onCompleteAssessment,
  onSaveAnswersProgress,
}) => {
  if (!isOpen || !participant) return null;

  // Step 1: Basic Details, Step 2: 40 Questions, Step 3: Profile Report
  const [step, setStep] = useState<1 | 2 | 3>(
    participant.firstAssignmentStatus === 'Report_Generated' ? 3 : 1
  );

  // View mode inside Step 2: 'card' (1 question at a time) or 'sheet' (all 40 questions list)
  const [viewMode, setViewMode] = useState<'card' | 'sheet'>('card');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Answers store: map of questionNumber (1-40) -> chosen option value (string)
  // Loads actual saved answers from participant record!
  const [answers, setAnswers] = useState<Record<number, string>>(() => {
    if (participant.assessmentAnswers && Object.keys(participant.assessmentAnswers).length > 0) {
      return participant.assessmentAnswers;
    }
    return {};
  });

  const totalAnswered = useMemo(() => Object.keys(answers).length, [answers]);
  const strengthsAnswered = useMemo(() => {
    return CFL_PAW_QUESTIONS.slice(0, 20).filter(q => !!answers[q.questionNumber]).length;
  }, [answers]);
  const weaknessesAnswered = useMemo(() => {
    return CFL_PAW_QUESTIONS.slice(20, 40).filter(q => !!answers[q.questionNumber]).length;
  }, [answers]);

  // Scoring engine calculation
  const scoreReport = useMemo(() => {
    const scores: Record<TemperamentType, { strengths: number; weaknesses: number; total: number }> = {
      Sanguine: { strengths: 0, weaknesses: 0, total: 0 },
      Choleric: { strengths: 0, weaknesses: 0, total: 0 },
      Melancholy: { strengths: 0, weaknesses: 0, total: 0 },
      Phlegmatic: { strengths: 0, weaknesses: 0, total: 0 },
    };

    CFL_PAW_QUESTIONS.forEach((q) => {
      const selectedValue = answers[q.questionNumber];
      if (selectedValue) {
        const option = q.options.find((o) => o.value === selectedValue);
        if (option) {
          if (q.type === 'Strengths') {
            scores[option.temperament].strengths += 1;
          } else {
            scores[option.temperament].weaknesses += 1;
          }
          scores[option.temperament].total += 1;
        }
      }
    });

    const sorted = (Object.keys(scores) as TemperamentType[]).sort(
      (a, b) => scores[b].total - scores[a].total
    );

    const dominant = sorted[0];
    const secondary = sorted[1];

    const blendName = `${TEMPERAMENT_PROFILES[dominant].name} - ${TEMPERAMENT_PROFILES[secondary].name}`;

    return {
      scores,
      dominant,
      secondary,
      blendName,
    };
  }, [answers]);

  const handleSelectOption = (questionNumber: number, optionValue: string) => {
    const nextAnswers = {
      ...answers,
      [questionNumber]: optionValue,
    };
    setAnswers(nextAnswers);
    if (onSaveAnswersProgress) {
      onSaveAnswersProgress(participant.id, nextAnswers);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < CFL_PAW_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      finalizeAssessment();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const finalizeAssessment = () => {
    if (totalAnswered < 40) {
      const confirmIncomplete = window.confirm(
        `You have answered ${totalAnswered} of 40 questions. Would you like to proceed and calculate the report based on answered traits?`
      );
      if (!confirmIncomplete) return;
    }

    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // fallback if canvas not available
    }

    setStep(3);
    onCompleteAssessment(
      participant.id, 
      scoreReport.blendName,
      answers,
      scoreReport.scores,
      scoreReport.dominant,
      scoreReport.secondary
    );
  };

  const handleCopyWhatsAppSummary = () => {
    const text = `*PAW Personality Profile Analysis Report*\n` +
      `*Participant:* ${participant.fullName} (ID: ${participant.loginId})\n` +
      `*Workshop Batch:* ${participant.pawBatchId}\n\n` +
      `🏆 *Primary Dominant:* ${TEMPERAMENT_PROFILES[scoreReport.dominant].name} (${scoreReport.scores[scoreReport.dominant].total}/40)\n` +
      `🥈 *Secondary Supporting:* ${TEMPERAMENT_PROFILES[scoreReport.secondary].name} (${scoreReport.scores[scoreReport.secondary].total}/40)\n\n` +
      `📊 *Score Matrix:*\n` +
      `• Sanguine: ${scoreReport.scores.Sanguine.total}/40 (${Math.round((scoreReport.scores.Sanguine.total/40)*100)}%)\n` +
      `• Choleric: ${scoreReport.scores.Choleric.total}/40 (${Math.round((scoreReport.scores.Choleric.total/40)*100)}%)\n` +
      `• Melancholy: ${scoreReport.scores.Melancholy.total}/40 (${Math.round((scoreReport.scores.Melancholy.total/40)*100)}%)\n` +
      `• Phlegmatic: ${scoreReport.scores.Phlegmatic.total}/40 (${Math.round((scoreReport.scores.Phlegmatic.total/40)*100)}%)\n\n` +
      `🌟 *Superpowers:*\n${TEMPERAMENT_PROFILES[scoreReport.dominant].keyStrengths.map(s => '• ' + s).join('\n')}\n\n` +
      `💡 *Growth Opportunities:*\n${TEMPERAMENT_PROFILES[scoreReport.dominant].growthAreas.map(g => '• ' + g).join('\n')}\n\n` +
      `_Coach For Life • Personality Awareness Workshop (PAW)_`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };


  const handleDemoPreFill = () => {
    const demoAnswers: Record<number, string> = {};
    // Generate a natural pattern with high Choleric / Sanguine
    CFL_PAW_QUESTIONS.forEach((q, idx) => {
      // Pick predominantly Choleric and Sanguine
      let targetTemperament: TemperamentType = 'Choleric';
      if (idx % 3 === 0) targetTemperament = 'Choleric';
      else if (idx % 3 === 1) targetTemperament = 'Sanguine';
      else if (idx % 5 === 0) targetTemperament = 'Melancholy';
      else targetTemperament = 'Phlegmatic';

      const matchedOption = q.options.find(o => o.temperament === targetTemperament) || q.options[0];
      demoAnswers[q.questionNumber] = matchedOption.value;
    });

    setAnswers(demoAnswers);
  };

  const handlePrint = () => {
    window.print();
  };

  const currentQ = CFL_PAW_QUESTIONS[currentQuestionIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl my-4 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top Sticky Header */}
        <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-slate-200 bg-white z-10 gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-semibold text-blue-700 tracking-wide uppercase">
                  Coach For Life • PAW Personality Profile
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
                  Login ID: {participant.loginId}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                40-Question Personality Profile Analysis
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200">
              Language: English
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3 Step Breadcrumb Navigation */}
        <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center justify-between max-w-xl mx-auto text-xs">
            <button
              onClick={() => setStep(1)}
              className={`flex items-center space-x-2 cursor-pointer transition ${
                step === 1 ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                1
              </div>
              <span>1. Basic Details</span>
            </button>

            <div className="w-12 h-px bg-slate-200" />

            <button
              onClick={() => setStep(2)}
              className={`flex items-center space-x-2 cursor-pointer transition ${
                step === 2 ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                2
              </div>
              <span>2. 40 Questions ({totalAnswered}/40)</span>
            </button>

            <div className="w-12 h-px bg-slate-200" />

            <button
              onClick={() => {
                if (totalAnswered > 0) setStep(3);
              }}
              disabled={totalAnswered === 0}
              className={`flex items-center space-x-2 transition ${
                step === 3 
                  ? 'text-blue-700 font-bold' 
                  : totalAnswered > 0 
                  ? 'text-slate-500 hover:text-slate-800 cursor-pointer' 
                  : 'text-slate-300 cursor-not-allowed'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step === 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                3
              </div>
              <span>3. Profile Report</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* ================= STEP 1: BASIC DETAILS & INSTRUCTIONS ================= */}
          {step === 1 && (
            <div className="max-w-2xl mx-auto space-y-6 py-2">
              <div className="text-center space-y-1">
                <h4 className="text-lg font-bold text-slate-900">
                  Welcome to Your Personality Profile Analysis
                </h4>
                <p className="text-xs text-slate-600 max-w-lg mx-auto">
                  Please review your participant credentials below. These details will be printed on your official Personality Awareness Report.
                </p>
              </div>

              {/* Participant Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="p-3 bg-white rounded-lg border border-slate-200/80">
                  <span className="text-slate-500 block text-[11px] mb-0.5">Participant Full Name</span>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <strong className="text-slate-900 text-sm">{participant.fullName}</strong>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200/80">
                  <span className="text-slate-500 block text-[11px] mb-0.5">WhatsApp / Phone Number</span>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <strong className="text-slate-900 text-sm font-mono">{participant.phone}</strong>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200/80">
                  <span className="text-slate-500 block text-[11px] mb-0.5">Login ID</span>
                  <strong className="text-blue-700 text-sm font-mono">{participant.loginId}</strong>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200/80">
                  <span className="text-slate-500 block text-[11px] mb-0.5">Assessment Language</span>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <strong className="text-slate-900 text-sm">English (Official Coach For Life)</strong>
                  </div>
                </div>
              </div>

              {/* Official Instructions Card */}
              <div className="p-5 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-blue-950">
                      Official Assessment Instructions
                    </h5>
                    <p className="text-xs text-blue-900 mt-1 leading-relaxed">
                      "Please select 1 of the 4 options in each Question. Continue through all 40 Questions; If you are not sure which word 'most applies' ask a spouse or a friend, and think of what your answer would have been when you were a child."
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-blue-200/60 text-xs">
                  <div className="flex items-center space-x-2 text-blue-900">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span><strong>Part 1 (Questions 1 to 20):</strong> Strengths</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-900">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span><strong>Part 2 (Questions 21 to 40):</strong> Weaknesses</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDemoPreFill}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Auto-Fill Demo Responses (Quick Review)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition flex items-center justify-center gap-2"
                >
                  <span>Begin 40-Question Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: 40 QUESTIONS ENGINE ================= */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Progress Summary & View Mode Bar */}
              <div className="flex flex-wrap items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 gap-3 text-xs">
                <div className="flex items-center space-x-4">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Total Answered</span>
                    <strong className="text-slate-900 font-mono text-sm">
                      {totalAnswered} / 40 <span className="text-slate-400 font-normal">({Math.round((totalAnswered / 40) * 100)}%)</span>
                    </strong>
                  </div>
                  <div className="h-6 w-px bg-slate-200" />
                  <div>
                    <span className="text-slate-500 block text-[11px]">Part 1 (Strengths)</span>
                    <strong className="text-blue-700 font-mono text-sm">{strengthsAnswered} / 20</strong>
                  </div>
                  <div className="h-6 w-px bg-slate-200" />
                  <div>
                    <span className="text-slate-500 block text-[11px]">Part 2 (Weaknesses)</span>
                    <strong className="text-rose-700 font-mono text-sm">{weaknessesAnswered} / 20</strong>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* View mode toggle */}
                  <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setViewMode('card')}
                      className={`px-3 py-1 rounded-md font-medium transition flex items-center gap-1 ${
                        viewMode === 'card'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Step-by-Step</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('sheet')}
                      className={`px-3 py-1 rounded-md font-medium transition flex items-center gap-1 ${
                        viewMode === 'sheet'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <LayoutList className="w-3.5 h-3.5" />
                      <span>All 40 Questions</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleDemoPreFill}
                    className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                    title="Auto-fill for demonstration"
                  >
                    Demo Fill
                  </button>
                </div>
              </div>

              {/* Visual Global Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                  style={{ width: `${(totalAnswered / 40) * 100}%` }}
                />
              </div>

              {/* Quick Jump Palette (1-40) */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Quick Jump Palette (Click any question number):</span>
                  <span>
                    Green: Answered • Grey: Unanswered
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {CFL_PAW_QUESTIONS.map((q, idx) => {
                    const isAnswered = !!answers[q.questionNumber];
                    const isCurrent = viewMode === 'card' && currentQuestionIndex === idx;

                    return (
                      <button
                        key={q.questionNumber}
                        type="button"
                        onClick={() => {
                          setCurrentQuestionIndex(idx);
                          if (viewMode === 'sheet') {
                            const el = document.getElementById(`q-item-${q.questionNumber}`);
                            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }
                        }}
                        className={`w-7 h-7 text-xs font-mono font-medium rounded-md transition flex items-center justify-center ${
                          isCurrent
                            ? 'ring-2 ring-blue-600 ring-offset-1 font-bold'
                            : ''
                        } ${
                          isAnswered
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {q.questionNumber}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* VIEW MODE 1: STEP-BY-STEP SINGLE CARD */}
              {viewMode === 'card' && (
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
                  {/* Question Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-1 rounded-md font-mono text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        Question {currentQ.questionNumber} of 40
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        currentQ.type === 'Strengths' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        Part {currentQ.questionNumber <= 20 ? '1: Strengths' : '2: Weaknesses'}
                      </span>
                    </div>

                    <span className="text-xs text-slate-400 font-mono">
                      {answers[currentQ.questionNumber] ? (
                        <span className="text-emerald-600 font-medium flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Answered
                        </span>
                      ) : (
                        'Select 1 option below'
                      )}
                    </span>
                  </div>

                  {/* Question Prompt */}
                  <p className="text-xs text-slate-500 font-medium">
                    Select the word and description that most accurately describes your natural personality:
                  </p>

                  {/* 4 Options Grid/List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentQ.options.map((option) => {
                      const isSelected = answers[currentQ.questionNumber] === option.value;

                      return (
                        <div
                          key={option.value}
                          onClick={() => handleSelectOption(currentQ.questionNumber, option.value)}
                          className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between select-none ${
                            isSelected
                              ? 'bg-blue-50/80 border-blue-500 text-blue-950 shadow-xs ring-1 ring-blue-500'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/80'
                          }`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-slate-900 tracking-tight">
                                {option.word}
                              </span>
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition shrink-0 ${
                                isSelected
                                  ? 'border-blue-600 bg-blue-600 text-white'
                                  : 'border-slate-300 bg-white'
                              }`}>
                                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              ({option.description})
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Card Navigation */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handlePrev}
                      disabled={currentQuestionIndex === 0}
                      className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 border border-slate-200 hover:bg-slate-50"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Previous Question</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition flex items-center gap-2"
                    >
                      <span>
                        {currentQuestionIndex === 39 ? 'Finish & Generate Report' : 'Next Question'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* VIEW MODE 2: ALL 40 QUESTIONS SHEET (CFL Web Layout) */}
              {viewMode === 'sheet' && (
                <div className="space-y-6">
                  {/* Part 1 Header */}
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-emerald-900 text-sm">Part 1: Strengths</strong>
                      <span className="text-emerald-700 ml-2">(Questions 1 to 20)</span>
                    </div>
                    <span className="font-mono font-medium text-emerald-800">
                      {strengthsAnswered} / 20 Completed
                    </span>
                  </div>

                  {/* Questions 1 to 20 */}
                  <div className="space-y-3">
                    {CFL_PAW_QUESTIONS.slice(0, 20).map((q) => {
                      const selectedVal = answers[q.questionNumber];

                      return (
                        <div
                          key={q.questionNumber}
                          id={`q-item-${q.questionNumber}`}
                          className={`p-4 rounded-xl border bg-white transition ${
                            selectedVal
                              ? 'border-slate-300'
                              : 'border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-800 font-mono">
                              Question {q.questionNumber}
                            </span>
                            {selectedVal ? (
                              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Answered
                              </span>
                            ) : (
                              <span className="text-[11px] text-amber-600 font-medium">
                                Pending selection
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {q.options.map((opt) => {
                              const isChecked = selectedVal === opt.value;
                              return (
                                <label
                                  key={opt.value}
                                  className={`p-2.5 rounded-lg border cursor-pointer flex items-start space-x-2.5 transition ${
                                    isChecked
                                      ? 'bg-blue-50 border-blue-400 text-blue-950 font-medium'
                                      : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`q-${q.questionNumber}`}
                                    checked={isChecked}
                                    onChange={() => handleSelectOption(q.questionNumber, opt.value)}
                                    className="mt-0.5 text-blue-600 focus:ring-blue-500 shrink-0"
                                  />
                                  <div>
                                    <strong className="text-slate-900 block">{opt.word}</strong>
                                    <span className="text-[11px] text-slate-600">({opt.description})</span>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Part 2 Header */}
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs mt-6">
                    <div>
                      <strong className="text-rose-900 text-sm">Part 2: Weaknesses</strong>
                      <span className="text-rose-700 ml-2">(Questions 21 to 40)</span>
                    </div>
                    <span className="font-mono font-medium text-rose-800">
                      {weaknessesAnswered} / 20 Completed
                    </span>
                  </div>

                  {/* Questions 21 to 40 */}
                  <div className="space-y-3">
                    {CFL_PAW_QUESTIONS.slice(20, 40).map((q) => {
                      const selectedVal = answers[q.questionNumber];

                      return (
                        <div
                          key={q.questionNumber}
                          id={`q-item-${q.questionNumber}`}
                          className={`p-4 rounded-xl border bg-white transition ${
                            selectedVal
                              ? 'border-slate-300'
                              : 'border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-800 font-mono">
                              Question {q.questionNumber}
                            </span>
                            {selectedVal ? (
                              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Answered
                              </span>
                            ) : (
                              <span className="text-[11px] text-amber-600 font-medium">
                                Pending selection
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {q.options.map((opt) => {
                              const isChecked = selectedVal === opt.value;
                              return (
                                <label
                                  key={opt.value}
                                  className={`p-2.5 rounded-lg border cursor-pointer flex items-start space-x-2.5 transition ${
                                    isChecked
                                      ? 'bg-blue-50 border-blue-400 text-blue-950 font-medium'
                                      : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`q-${q.questionNumber}`}
                                    checked={isChecked}
                                    onChange={() => handleSelectOption(q.questionNumber, opt.value)}
                                    className="mt-0.5 text-blue-600 focus:ring-blue-500 shrink-0"
                                  />
                                  <div>
                                    <strong className="text-slate-900 block">{opt.word}</strong>
                                    <span className="text-[11px] text-slate-600">({opt.description})</span>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom Action for Sheet View */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs sticky bottom-0 z-10 shadow-md">
                    <span className="font-medium text-slate-700">
                      Answered: <strong>{totalAnswered} / 40</strong> questions
                    </span>
                    <button
                      type="button"
                      onClick={finalizeAssessment}
                      className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition flex items-center gap-2"
                    >
                      <span>Submit & Generate Personality Report</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 3: OFFICIAL PROFILE REPORT ================= */}
          {step === 3 && (
            <div className="space-y-6 py-2 print:p-0">
              {/* Report Header Card */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div>
                    <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider block">
                      Official Personality Profile Analysis Report
                    </span>
                    <h4 className="text-lg font-bold text-slate-900 mt-0.5">
                      {participant.fullName}
                    </h4>
                    <p className="text-xs text-slate-500 font-mono">
                      Login ID: {participant.loginId} • Mobile: {participant.phone} • Batch: {participant.pawBatchId}
                    </p>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-[11px] text-slate-500">Report Status</span>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Generated & Verified
                    </span>
                  </div>
                </div>

                {/* Dominant & Secondary Temperament Highlight */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Dominant */}
                  <div className={`p-4 rounded-xl border ${TEMPERAMENT_PROFILES[scoreReport.dominant].borderColor} ${TEMPERAMENT_PROFILES[scoreReport.dominant].bgLight}`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                        Primary Dominant Temperament
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${TEMPERAMENT_PROFILES[scoreReport.dominant].tagColor}`}>
                        Score: {scoreReport.scores[scoreReport.dominant].total} / 40
                      </span>
                    </div>
                    <h5 className={`text-base font-bold ${TEMPERAMENT_PROFILES[scoreReport.dominant].color}`}>
                      {TEMPERAMENT_PROFILES[scoreReport.dominant].name}
                    </h5>
                    <p className="text-xs text-slate-700 font-medium mt-0.5">
                      {TEMPERAMENT_PROFILES[scoreReport.dominant].archetype}
                    </p>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {TEMPERAMENT_PROFILES[scoreReport.dominant].summary}
                    </p>
                  </div>

                  {/* Secondary */}
                  <div className={`p-4 rounded-xl border ${TEMPERAMENT_PROFILES[scoreReport.secondary].borderColor} ${TEMPERAMENT_PROFILES[scoreReport.secondary].bgLight}`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                        Secondary Supporting Temperament
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${TEMPERAMENT_PROFILES[scoreReport.secondary].tagColor}`}>
                        Score: {scoreReport.scores[scoreReport.secondary].total} / 40
                      </span>
                    </div>
                    <h5 className={`text-base font-bold ${TEMPERAMENT_PROFILES[scoreReport.secondary].color}`}>
                      {TEMPERAMENT_PROFILES[scoreReport.secondary].name}
                    </h5>
                    <p className="text-xs text-slate-700 font-medium mt-0.5">
                      {TEMPERAMENT_PROFILES[scoreReport.secondary].archetype}
                    </p>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {TEMPERAMENT_PROFILES[scoreReport.secondary].summary}
                    </p>
                  </div>
                </div>

                {/* 4 Quadrants Score Breakdown Table */}
                <div className="pt-2">
                  <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Four Temperament Score Matrix (Strengths vs. Weaknesses)
                  </h5>
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                        <tr>
                          <th className="py-2.5 px-4 font-semibold">Personality Temperament</th>
                          <th className="py-2.5 px-3 font-semibold text-center">Part 1: Strengths (/20)</th>
                          <th className="py-2.5 px-3 font-semibold text-center">Part 2: Weaknesses (/20)</th>
                          <th className="py-2.5 px-3 font-semibold text-center">Total Score (/40)</th>
                          <th className="py-2.5 px-4 font-semibold text-right">Distribution (%)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(['Sanguine', 'Choleric', 'Melancholy', 'Phlegmatic'] as TemperamentType[]).map((t) => {
                          const s = scoreReport.scores[t];
                          const pct = totalAnswered > 0 ? Math.round((s.total / totalAnswered) * 100) : 0;
                          const isDominant = t === scoreReport.dominant;

                          return (
                            <tr key={t} className={isDominant ? 'bg-blue-50/40 font-semibold' : 'hover:bg-slate-50/50'}>
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-2">
                                  <span className={`w-2.5 h-2.5 rounded-full ${
                                    t === 'Sanguine' ? 'bg-amber-500' :
                                    t === 'Choleric' ? 'bg-rose-500' :
                                    t === 'Melancholy' ? 'bg-blue-500' : 'bg-emerald-500'
                                  }`} />
                                  <span className="text-slate-900">{TEMPERAMENT_PROFILES[t].name}</span>
                                  {isDominant && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                                      Dominant
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-3 text-center font-mono">{s.strengths}</td>
                              <td className="py-3 px-3 text-center font-mono">{s.weaknesses}</td>
                              <td className="py-3 px-3 text-center font-mono font-bold text-slate-900">{s.total}</td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <div className="w-20 h-2 rounded-full bg-slate-100 overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${
                                        t === 'Sanguine' ? 'bg-amber-500' :
                                        t === 'Choleric' ? 'bg-rose-500' :
                                        t === 'Melancholy' ? 'bg-blue-500' : 'bg-emerald-500'
                                      }`}
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                  <span className="font-mono text-slate-600 w-8">{pct}%</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Deep Behavioral Insights: Strengths, Needs, Growth */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3">
                  {/* Core Strengths */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center space-x-1.5 text-blue-800 font-bold">
                      <Award className="w-4 h-4" />
                      <span>Natural Superpowers</span>
                    </div>
                    <ul className="space-y-1.5 text-slate-700">
                      {TEMPERAMENT_PROFILES[scoreReport.dominant].keyStrengths.map((ks, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span>{ks}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Emotional Needs */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center space-x-1.5 text-emerald-800 font-bold">
                      <Sparkles className="w-4 h-4" />
                      <span>Core Emotional Needs</span>
                    </div>
                    <ul className="space-y-1.5 text-slate-700">
                      {TEMPERAMENT_PROFILES[scoreReport.dominant].emotionalNeeds.map((en, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                          <span>{en}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Growth Areas */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center space-x-1.5 text-amber-800 font-bold">
                      <AlertCircle className="w-4 h-4" />
                      <span>Key Growth Opportunities</span>
                    </div>
                    <ul className="space-y-1.5 text-slate-700">
                      {TEMPERAMENT_PROFILES[scoreReport.dominant].growthAreas.map((ga, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <ArrowRight className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>{ga}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 print:hidden">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                >
                  Review / Modify 40 Answers
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleCopyWhatsAppSummary}
                    className="px-3.5 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 transition border border-emerald-200"
                    title="Copy formatted WhatsApp summary"
                  >
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{copiedSummary ? 'Copied Summary! ✓' : 'Copy WhatsApp Summary'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-200"
                  >
                    <Printer className="w-4 h-4 text-slate-600" />
                    <span>Print Report</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                    }}
                    className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-sm"
                  >
                    Done & Save to Profile
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
