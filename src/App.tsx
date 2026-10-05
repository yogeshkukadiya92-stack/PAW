import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  PAWBatch, 
  ICLMember, 
  CallingLead, 
  Participant, 
  UserRole, 
  CallStatus, 
  WelcomeChecklist 
} from '@/types/paw';
import { INITIAL_BATCHES } from '@/lib/mock-data';
import { 
  loadStoredBatches, 
  saveStoredBatches, 
  loadStoredMembers,
  saveStoredMembers,
  loadStoredLeads, 
  saveStoredLeads, 
  loadStoredParticipants, 
  saveStoredParticipants,
  resetToInitialData 
} from '@/lib/storage';

import { Header } from '@/components/Header';
import { NewBatchModal } from '@/components/NewBatchModal';
import { MissionCallingView } from '@/components/MissionCallingView';
import { CallLogModal } from '@/components/CallLogModal';
import { WelcomeFollowupView } from '@/components/WelcomeFollowupView';
import { WelcomeChecklistModal } from '@/components/WelcomeChecklistModal';
import { ParticipantAssessmentModal } from '@/components/ParticipantAssessmentModal';
import { EscalationDrawer } from '@/components/EscalationDrawer';
import { CertificateModal } from '@/components/CertificateModal';
import { ManageTeamModal } from '@/components/ManageTeamModal';
import { ParticipantLivePortal } from '@/components/ParticipantLivePortal';

export default function App() {
  // Main Data States with localStorage persistence
  const [batches, setBatches] = useState<PAWBatch[]>(() => loadStoredBatches());
  const [selectedBatch, setSelectedBatch] = useState<PAWBatch>(() => {
    const loaded = loadStoredBatches();
    return loaded[0] || INITIAL_BATCHES[0];
  });
  const [members, setMembers] = useState<ICLMember[]>(() => loadStoredMembers());
  const [leads, setLeads] = useState<CallingLead[]>(() => loadStoredLeads());
  const [participants, setParticipants] = useState<Participant[]>(() => loadStoredParticipants());

  // Active View / Role Simulator
  const [currentRole, setCurrentRole] = useState<UserRole | 'PARTICIPANT_VIEW'>('PAW_HEAD');

  // Modal States
  const [isNewBatchOpen, setIsNewBatchOpen] = useState(false);
  const [isManageTeamOpen, setIsManageTeamOpen] = useState(false);
  const [selectedLeadForLog, setSelectedLeadForLog] = useState<CallingLead | null>(null);
  const [isCallLogOpen, setIsCallLogOpen] = useState(false);

  const [selectedParticipantForChecklist, setSelectedParticipantForChecklist] = useState<Participant | null>(null);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);

  const [selectedParticipantForAssessment, setSelectedParticipantForAssessment] = useState<Participant | null>(null);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);

  const [selectedParticipantForCertificate, setSelectedParticipantForCertificate] = useState<Participant | null>(null);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  const [isEscalationsOpen, setIsEscalationsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Persistence Effects
  useEffect(() => {
    saveStoredBatches(batches);
  }, [batches]);

  useEffect(() => {
    saveStoredMembers(members);
  }, [members]);

  useEffect(() => {
    saveStoredLeads(leads);
  }, [leads]);

  useEffect(() => {
    saveStoredParticipants(participants);
  }, [participants]);

  // Filter Members by Teams
  const callingMembers = members.filter((m) => m.team === 'CALLING');
  const welcomeMembers = members.filter((m) => m.team === 'WELCOME_FOLLOWUP');

  // Stats calculation
  const batchLeads = leads.filter((l) => l.pawBatchId === selectedBatch.id);
  const batchParticipants = participants.filter((p) => p.pawBatchId === selectedBatch.id);
  const registeredCount = batchParticipants.length;
  const welcomeCompletedCount = batchParticipants.filter((p) => p.welcomeCallStatus === 'Completed').length;
  const assignmentsDoneCount = batchParticipants.filter(
    (p) => p.firstAssignmentStatus === 'Report_Generated' || p.firstAssignmentStatus === 'Submitted'
  ).length;

  const escalatedParticipants = batchParticipants.filter((p) =>
    p.followups.some((f) => f.escalatedToLeader)
  );

  // 1. Batch Created Handler
  const handleBatchCreated = (newBatch: PAWBatch) => {
    setBatches([newBatch, ...batches]);
    setSelectedBatch(newBatch);
    showToast(`Created new PAW Batch: ${newBatch.name} (${newBatch.type})`);
  };

  // 2. Add New Lead Handler
  const handleAddNewLead = (fullName: string, phone: string, city: string, memberId: string) => {
    const newLead: CallingLead = {
      id: `lead-${Date.now().toString().slice(-4)}`,
      pawBatchId: selectedBatch.id,
      fullName,
      phone,
      city,
      assignedMemberId: memberId,
      callStatus: 'PENDING',
      callLogs: [],
    };
    setLeads([newLead, ...leads]);
    showToast(`Added lead ${fullName} successfully!`);
  };

  // 2b. Bulk Import Leads Handler
  const handleBulkImportLeads = (newLeadsData: Omit<CallingLead, 'id' | 'callLogs'>[]) => {
    const now = Date.now();
    const createdLeads: CallingLead[] = newLeadsData.map((d, idx) => ({
      ...d,
      id: `lead-${now}-${idx}`,
      callLogs: [],
    }));
    setLeads((prev) => [...createdLeads, ...prev]);
    showToast(`Imported & allocated ${createdLeads.length} leads across calling members!`);
  };

  // 2c. Direct Add Participant Handler (Welcome View)
  const handleAddParticipant = (newParticipant: Participant) => {
    setParticipants((prev) => [newParticipant, ...prev]);
    showToast(`Directly registered ${newParticipant.fullName} (ID: ${newParticipant.loginId})!`);
  };

  // 3. Save Call Log Handler
  const handleSaveCallLog = (
    leadId: string, 
    status: CallStatus, 
    note: string, 
    callbackDate?: string
  ) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === leadId) {
          const newLog = {
            id: `cl-${Date.now()}`,
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
            status,
            note: note || `Status updated to ${status}`,
            callbackDate,
          };
          return {
            ...lead,
            callStatus: status,
            callLogs: [newLog, ...(lead.callLogs || [])],
            nextFollowupDate: callbackDate || lead.nextFollowupDate,
            lastCalledAt: new Date().toISOString(),
          };
        }
        return lead;
      })
    );
    showToast(`Call status updated to ${status}`);
  };

  // 4. Mission Calling -> Registration & Handover to Welcome Team
  const handleRegisterAndHandover = (lead: CallingLead) => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }

    setLeads((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, callStatus: 'REGISTERED' as CallStatus } : l))
    );

    const sortedWelcomeMembers = [...welcomeMembers].sort((a, b) => {
      const countA = participants.filter((p) => p.assignedWelcomeIclMemberId === a.id).length;
      const countB = participants.filter((p) => p.assignedWelcomeIclMemberId === b.id).length;
      return countA - countB;
    });
    const assignedWelcomeMember = sortedWelcomeMembers[0] || welcomeMembers[0];

    const nextIdNum = String(participants.length + 1).padStart(3, '0');
    const newParticipant: Participant = {
      id: `part-${Date.now()}`,
      loginId: `${selectedBatch.code || 'PAW'}-${nextIdNum}`,
      pawBatchId: selectedBatch.id,
      fullName: lead.fullName,
      phone: lead.phone,
      whatsappNumber: lead.phone,
      preferredLanguage: 'en',
      city: lead.city,
      registeredAt: new Date().toISOString().split('T')[0],
      registrationStatus: 'Confirmed',
      whatsappGroupJoined: false,
      assignedCallingMemberId: lead.assignedMemberId,
      assignedWelcomeIclMemberId: assignedWelcomeMember.id,
      welcomeCallStatus: 'Pending',
      welcomeChecklist: {
        verified: false,
        datesConfirmed: false,
        whatsappConfirmed: false,
        firstAssignmentGuided: false,
        techSupportProvided: false,
        doubtsCleared: false,
        attendanceConfirmed: false,
        remarks: `Handed over from Calling Team. Welcome Call assigned to ${assignedWelcomeMember.name}.`,
      },
      firstAssignmentStatus: 'Not_Started',
      followups: [],
    };

    setParticipants([newParticipant, ...participants]);
    showToast(`Registered & handed over ${lead.fullName} to Welcome Team (${assignedWelcomeMember.name})!`);
  };

  // 5. Welcome Call Checklist Save
  const handleSaveWelcomeChecklist = (
    participantId: string,
    checklist: WelcomeChecklist,
    status: 'Completed' | 'Callback_Required' | 'Unreachable'
  ) => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id === participantId) {
          return {
            ...p,
            welcomeCallStatus: status,
            welcomeChecklist: checklist,
            whatsappGroupJoined: checklist.whatsappConfirmed || p.whatsappGroupJoined,
          };
        }
        return p;
      })
    );
    showToast(`Welcome Call checklist updated (${status})!`);
  };

  // 6. Escalate to Leader
  const handleEscalateToLeader = (participantId: string, reason: string) => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id === participantId) {
          const newFollowup = {
            id: `f-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            sessionNumber: 0,
            attended: false,
            assignmentCompleted: false,
            supportRequired: 'Other' as const,
            iclRemark: reason,
            escalatedToLeader: true,
          };
          return {
            ...p,
            followups: [newFollowup, ...p.followups],
          };
        }
        return p;
      })
    );
    showToast(`Escalated participant to Team Leader.`);
  };

  // 7. Resolve Escalation
  const handleResolveEscalation = (participantId: string) => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id === participantId) {
          return {
            ...p,
            followups: p.followups.map((f) => ({ ...f, escalatedToLeader: false })),
          };
        }
        return p;
      })
    );
    showToast(`Escalation resolved successfully.`);
  };

  // 8. Complete 40-Q Assessment (Wired with real answers and scores!)
  const handleCompleteAssessment = (
    participantId: string, 
    personalityType: string,
    answers?: Record<number, string>,
    scores?: any,
    dominant?: string,
    secondary?: string
  ) => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id === participantId) {
          return {
            ...p,
            firstAssignmentStatus: 'Report_Generated',
            personalityType,
            assessmentAnswers: answers || p.assessmentAnswers,
            temperamentScores: scores || p.temperamentScores,
            dominantTemperament: dominant || p.dominantTemperament,
            secondaryTemperament: secondary || p.secondaryTemperament,
          };
        }
        return p;
      })
    );
    showToast(`Personality Report saved to participant profile!`);
  };

  // 8b. Real-time answers progress save
  const handleSaveAnswersProgress = (participantId: string, answers: Record<number, string>) => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id === participantId) {
          return {
            ...p,
            assessmentAnswers: answers,
            firstAssignmentStatus: Object.keys(answers).length >= 40 ? 'Submitted' : 'In_Progress',
          };
        }
        return p;
      })
    );
  };

  // 9. Quick WhatsApp Joined Toggle
  const handleToggleWhatsApp = (participantId: string) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === participantId ? { ...p, whatsappGroupJoined: !p.whatsappGroupJoined } : p
      )
    );
  };

  // 10. Multi-Day Session Attendance Toggle (Day 1, Day 2, Day 3)
  const handleToggleSessionAttendance = (participantId: string, sessionIndex: number) => {
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.id === participantId) {
          const existingIndex = p.followups.findIndex((f) => f.sessionNumber === sessionIndex);
          let newFollowups = [...p.followups];

          if (existingIndex >= 0) {
            newFollowups[existingIndex] = {
              ...newFollowups[existingIndex],
              attended: !newFollowups[existingIndex].attended,
            };
          } else {
            newFollowups.push({
              id: `att-${sessionIndex}-${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              sessionNumber: sessionIndex,
              attended: true,
              assignmentCompleted: true,
              supportRequired: 'None',
              iclRemark: `Session ${sessionIndex} attended`,
              escalatedToLeader: false,
            });
          }

          return {
            ...p,
            followups: newFollowups,
          };
        }
        return p;
      })
    );
  };

  // Member Management Handlers
  const handleAddMember = (newMember: ICLMember) => {
    setMembers((prev) => [newMember, ...prev]);
    showToast(`Added ${newMember.name} to ICL team!`);
  };

  const handleToggleMemberAvailability = (memberId: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, isAvailable: !m.isAvailable } : m))
    );
  };

  const handleDeleteMember = (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    showToast('Member removed from team roster.');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        batches={batches}
        selectedBatch={selectedBatch}
        onSelectBatch={setSelectedBatch}
        onOpenNewBatchModal={() => setIsNewBatchOpen(true)}
        onOpenManageTeamModal={() => setIsManageTeamOpen(true)}
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        stats={{
          totalLeads: batchLeads.length,
          registered: registeredCount,
          welcomeCompleted: welcomeCompletedCount,
          assignmentsDone: assignmentsDoneCount,
          escalationsCount: escalatedParticipants.length,
        }}
        onOpenEscalations={() => setIsEscalationsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        {/* View Switcher based on currentRole */}
        {currentRole === 'PARTICIPANT_VIEW' ? (
          <ParticipantLivePortal
            participants={batchParticipants}
            onOpenAssessment={(p) => {
              setSelectedParticipantForAssessment(p);
              setIsAssessmentOpen(true);
            }}
            onOpenCertificate={(p) => {
              setSelectedParticipantForCertificate(p);
              setIsCertificateOpen(true);
            }}
          />
        ) : (
          <>
            {/* Mission Calling View (Active for PAW_HEAD and CALLING_MEMBER) */}
            {(currentRole === 'PAW_HEAD' || currentRole === 'CALLING_MEMBER' || currentRole === 'LEADER') && (
              <section>
                <MissionCallingView
                  batch={selectedBatch}
                  callingMembers={callingMembers}
                  leads={batchLeads}
                  onOpenCallLog={(lead) => {
                    setSelectedLeadForLog(lead);
                    setIsCallLogOpen(true);
                  }}
                  onRegisterAndHandover={handleRegisterAndHandover}
                  onAddNewLead={handleAddNewLead}
                  onBulkImportLeads={handleBulkImportLeads}
                />
              </section>
            )}

            {/* Welcome & Follow-up View (Active for PAW_HEAD and WELCOME_MEMBER) */}
            {(currentRole === 'PAW_HEAD' || currentRole === 'WELCOME_MEMBER') && (
              <section className="pt-4">
                <WelcomeFollowupView
                  batch={selectedBatch}
                  welcomeMembers={welcomeMembers}
                  participants={batchParticipants}
                  onOpenChecklistModal={(p) => {
                    setSelectedParticipantForChecklist(p);
                    setIsChecklistOpen(true);
                  }}
                  onOpenParticipantPortal={(p) => {
                    setSelectedParticipantForAssessment(p);
                    setIsAssessmentOpen(true);
                  }}
                  onOpenCertificateModal={(p) => {
                    setSelectedParticipantForCertificate(p);
                    setIsCertificateOpen(true);
                  }}
                  onToggleWhatsAppJoined={handleToggleWhatsApp}
                  onToggleSessionAttendance={handleToggleSessionAttendance}
                  onAddParticipant={handleAddParticipant}
                />
              </section>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3.5 px-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto w-full gap-2">
        <span>PAW Operating System • Coach For Life Live Platform</span>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset demo data back to initial defaults?')) {
              resetToInitialData();
              window.location.reload();
            }
          }}
          className="text-slate-500 hover:text-slate-800 underline transition"
        >
          Reset Demo Data
        </button>
      </footer>

      {/* MODALS */}
      {/* 1. New PAW Batch Modal */}
      <NewBatchModal
        isOpen={isNewBatchOpen}
        onClose={() => setIsNewBatchOpen(false)}
        availableMembers={members}
        onBatchCreated={handleBatchCreated}
      />

      {/* 2. Manage ICL Team Modal */}
      <ManageTeamModal
        isOpen={isManageTeamOpen}
        onClose={() => setIsManageTeamOpen(false)}
        members={members}
        onAddMember={handleAddMember}
        onToggleAvailability={handleToggleMemberAvailability}
        onDeleteMember={handleDeleteMember}
      />

      {/* 3. Call Log Modal */}
      <CallLogModal
        lead={selectedLeadForLog}
        isOpen={isCallLogOpen}
        onClose={() => {
          setIsCallLogOpen(false);
          setSelectedLeadForLog(null);
        }}
        onSaveLog={handleSaveCallLog}
        onRegisterAndHandover={handleRegisterAndHandover}
      />

      {/* 4. Welcome Call Checklist Modal */}
      <WelcomeChecklistModal
        participant={selectedParticipantForChecklist}
        isOpen={isChecklistOpen}
        onClose={() => {
          setIsChecklistOpen(false);
          setSelectedParticipantForChecklist(null);
        }}
        onSaveChecklist={handleSaveWelcomeChecklist}
        onEscalateToLeader={handleEscalateToLeader}
      />

      {/* 5. Participant 40-Q Assessment Modal */}
      <ParticipantAssessmentModal
        participant={selectedParticipantForAssessment}
        isOpen={isAssessmentOpen}
        onClose={() => {
          setIsAssessmentOpen(false);
          setSelectedParticipantForAssessment(null);
        }}
        onCompleteAssessment={handleCompleteAssessment}
        onSaveAnswersProgress={handleSaveAnswersProgress}
      />

      {/* 6. Leader Escalations Drawer */}
      <EscalationDrawer
        isOpen={isEscalationsOpen}
        onClose={() => setIsEscalationsOpen(false)}
        escalatedParticipants={escalatedParticipants}
        welcomeMembers={welcomeMembers}
        onResolveEscalation={handleResolveEscalation}
      />

      {/* 7. Participant Certificate Modal */}
      <CertificateModal
        participant={selectedParticipantForCertificate}
        batch={selectedBatch}
        isOpen={isCertificateOpen}
        onClose={() => {
          setIsCertificateOpen(false);
          setSelectedParticipantForCertificate(null);
        }}
      />
    </div>
  );
}
