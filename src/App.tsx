import { WorkshopMaintenance } from '@/components/WorkshopMaintenance';
import { WorkshopCompletion } from '@/components/WorkshopCompletion';
import { WorkshopReminders } from '@/components/WorkshopReminders';
import { WorkshopAssignments } from '@/components/WorkshopAssignments';
import { WorkshopSessions } from '@/components/WorkshopSessions';
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
import { loadStoredBatches, loadStoredMembers, loadStoredLeads, loadStoredParticipants } from '@/lib/storage';
import { type LoginUser, type Snapshot, type WorkspaceData, canManage } from '@/lib/api';
import { useWorkspace } from '@/lib/use-workspace';
import { AccountToolbar } from '@/components/AccountToolbar';
import { AccountsModal } from '@/components/AccountsModal';
import { ParticipantDashboard } from '@/components/ParticipantDashboard';

import { WorkshopProgress } from '@/components/WorkshopProgress';
import { Header } from '@/components/Header';
import { NewBatchModal } from '@/components/NewBatchModal';
import { MissionCallingView } from '@/components/MissionCallingView';
import { CallLogModal } from '@/components/CallLogModal';
import { WelcomeFollowupView } from '@/components/WelcomeFollowupView';
import { WelcomeChecklistModal } from '@/components/WelcomeChecklistModal';
import { AssessmentExperience, AssessmentExperienceModal } from '@/components/AssessmentExperience';
import { AssessmentDashboard, type DashboardTab } from '@/components/AssessmentDashboard';
import { ProfileHeader } from '@/components/ProfileHeader';
import { participantReports, type AssessmentReport } from '@/lib/assessment';
import type { AssessmentLanguage } from '@/lib/assessment-i18n';
import { roleLabels } from '@/lib/api';
import { EscalationDrawer } from '@/components/EscalationDrawer';
import { CertificateModal } from '@/components/CertificateModal';
import { ManageTeamModal } from '@/components/ManageTeamModal';
import { ParticipantLivePortal } from '@/components/ParticipantLivePortal';

interface AppProps { user: LoginUser; initialState: Snapshot; onLogout: () => Promise<void>; onUserChange: (user: LoginUser) => void; }
export default function App({ user, initialState, onLogout, onUserChange }: AppProps) {
  const { data, setData, saveStatus, saveError, retry, reload } = useWorkspace(initialState);
  const { batches, members, leads, participants } = data;
  const updateCollection = <K extends keyof WorkspaceData>(key: K, update: React.SetStateAction<WorkspaceData[K]>) => {
    setData(prev => ({...prev, [key]: typeof update === 'function' ? (update as (value: WorkspaceData[K]) => WorkspaceData[K])(prev[key]) : update}));
  };
  const setBatches = (value: React.SetStateAction<PAWBatch[]>) => updateCollection('batches', value);
  const setMembers = (value: React.SetStateAction<ICLMember[]>) => updateCollection('members', value);
  const setLeads = (value: React.SetStateAction<CallingLead[]>) => updateCollection('leads', value);
  const setParticipants = (value: React.SetStateAction<Participant[]>) => updateCollection('participants', value);
  const [selectedBatchId, setSelectedBatchId] = useState(() => {
    try { return localStorage.getItem(`paw_selected_batch_${user.id}`) || ''; } catch { return ''; }
  });
  const assignedBatchIds = new Set([...leads, ...participants].map(record => record.pawBatchId));
  const selectedBatch = batches.find(b => b.id === selectedBatchId)
    || (user.role !== 'PAW_HEAD' ? batches.find(b => assignedBatchIds.has(b.id)) : undefined)
    || batches[0];
  const setSelectedBatch = (batch: PAWBatch) => setSelectedBatchId(batch.id);
  const [currentRole, setCurrentRole] = useState<UserRole | 'PARTICIPANT_VIEW'>(user.role === 'PARTICIPANT' ? 'PARTICIPANT_VIEW' : canManage(user) ? 'PAW_HEAD' : user.role);
  const [dashboardTab,setDashboardTab]=useState<DashboardTab | 'progress' | 'assignments' | 'sessions' | 'completion' | 'maintenance'>('progress');
  const [progressBatchId, setProgressBatchId] = useState('ALL');
  const [profileLanguage,setProfileLanguage]=useState<AssessmentLanguage>('en');
  const [isAccountsOpen, setIsAccountsOpen] = useState(false);
  const [legacyData] = useState<WorkspaceData | null>(() => user.role === 'PAW_HEAD' ? {batches:loadStoredBatches(), members:loadStoredMembers(), leads:loadStoredLeads(), participants:loadStoredParticipants()} : null);
  const hasLegacy = legacyData && (['batches','members','leads','participants'] as const).some(key => legacyData[key].some(row => !data[key].some(current => current.id === row.id)));
  const importLegacy = () => {
    if (!legacyData) return;
    setData(prev => {
      const merged = {...prev};
      for (const key of ['batches','members','leads','participants'] as const) {
        (merged[key] as unknown[]) = [...prev[key], ...legacyData[key].filter(row => !prev[key].some(item => item.id === row.id))];
      }
      merged.participants = merged.participants.map(p => ['Submitted','Report_Generated'].includes(p.firstAssignmentStatus) && Object.keys(p.assessmentAnswers || {}).length < 40 ? {...p,firstAssignmentStatus:'In_Progress'} : p);
      return merged;
    });
    showToast('Importing your saved browser records into the shared workspace.');
  };

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

  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    if (selectedBatch) {
      try { localStorage.setItem(`paw_selected_batch_${user.id}`, selectedBatch.id); } catch {}
    }
  }, [selectedBatch?.id, user.id]);

  // Filter Members by Teams
  const callingMembers = members.filter((m) => m.team === 'CALLING');
  const welcomeMembers = members.filter((m) => m.team === 'WELCOME_FOLLOWUP');

  // Stats calculation
  const batchLeads = leads.filter((l) => l.pawBatchId === selectedBatch?.id);
  const batchParticipants = participants.filter((p) => p.pawBatchId === selectedBatch?.id);
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
    if (!selectedBatch) return;
    const newLead: CallingLead = {
      id: `lead-${crypto.randomUUID()}`,
      pawBatchId: selectedBatch?.id,
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
    if (participants.some(p => p.pawBatchId === newParticipant.pawBatchId && p.phone === newParticipant.phone)) {
      showToast('This phone number is already registered in this batch.');
      return;
    }
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
            nextFollowupDate: status === 'CALLBACK_REQUESTED' ? callbackDate : undefined,
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
    if (!selectedBatch || lead.callStatus === 'REGISTERED') return;
    if (!welcomeMembers.some(m => m.isAvailable)) {
      showToast('Add an available Welcome team member before registering a lead.');
      if (user.role === 'PAW_HEAD') setIsManageTeamOpen(true);
      return;
    }
    if (participants.some(p => p.pawBatchId === lead.pawBatchId && p.phone === lead.phone)) {
      showToast('This phone number is already registered in this batch.');
      return;
    }
    try {
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) confetti({
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

    const sortedWelcomeMembers = welcomeMembers.filter(m => m.isAvailable).sort((a, b) => {
      const countA = participants.filter((p) => p.assignedWelcomeIclMemberId === a.id).length;
      const countB = participants.filter((p) => p.assignedWelcomeIclMemberId === b.id).length;
      return countA - countB;
    });
    const assignedWelcomeMember = sortedWelcomeMembers[0] || welcomeMembers[0];

    const nextIdNum = String(participants.length + 1).padStart(3, '0');
    const newParticipant: Participant = {
      id: `part-${crypto.randomUUID()}`,
      loginId: `${selectedBatch.code || 'PAW'}-${crypto.randomUUID().slice(0,8).toUpperCase()}`,
      pawBatchId: selectedBatch?.id,
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

  const handleProfileComplete=(participantId:string, report:AssessmentReport)=>{
    setParticipants(previous=>previous.map(p=>p.id===participantId?{...p,assessmentAnswers:report.answers,preferredLanguage:report.language,firstAssignmentStatus:'Report_Generated',personalityType:`${report.dominant} - ${report.secondary}`,temperamentScores:report.scores,dominantTemperament:report.dominant,secondaryTemperament:report.secondary,assessmentReports:[report,...(p.assessmentReports||[])]}:p));
    showToast('Personality report saved to your profile.');
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
    if (leads.some(l => l.assignedMemberId === memberId) || participants.some(p => p.assignedWelcomeIclMemberId === memberId || p.assignedCallingMemberId === memberId) || batches.some(b => b.pawHeadId === memberId)) {
      showToast('This member owns records. Mark them unavailable instead of removing them.');
      return;
    }
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    showToast('Member removed from team roster.');
  };

  const toolbar = <AccountToolbar user={user} onAccounts={() => setIsAccountsOpen(true)} onLogout={() => {
    if (saveStatus !== 'saved') { showToast('Wait for your changes to save before signing out.'); return; }
    void onLogout().catch(error => showToast(error.message));
  }} saveStatus={saveStatus} onImport={hasLegacy ? importLegacy : undefined} />;
  const accountsModal = <AccountsModal isOpen={isAccountsOpen} onClose={() => setIsAccountsOpen(false)} user={user} data={data} onUserChange={onUserChange} />;
  const feedback = <>
    {toastMessage && <div role="status" className="fixed bottom-5 left-4 right-4 sm:left-auto sm:right-5 z-[60] bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-sm">{toastMessage}</div>}
    {saveError && <div role="alert" className="bg-rose-50 border-b border-rose-200 px-4 py-3 text-sm text-rose-800 flex flex-wrap items-center justify-center gap-3"><span>{saveError}</span><button className="underline font-semibold" onClick={() => void retry()}>Retry saving</button><button className="underline font-semibold" onClick={() => {
      if (window.confirm('Reload the shared records? Your unsaved changes will be discarded.')) void reload().catch(error => showToast(error.message));
    }}>Reload latest records</button></div>}
  </>;

  if (user.role === 'PARTICIPANT') {
    const participant = participants.find(p => p.id === user.participantId);
    const personalBatch=batches.find(b=>b.id===participant?.pawBatchId);
    return <div className="profile-app">{toolbar}{feedback}{accountsModal}<main className="profile-container workshop-progress">{participant&&personalBatch?<>
      <ParticipantDashboard participant={participant} batch={personalBatch} onAssessment={()=>setIsAssessmentOpen(true)} onCertificate={p=>{setSelectedParticipantForCertificate(p);setIsCertificateOpen(true);}}/>
      <WorkshopReminders participants={[participant]} batches={[personalBatch]} user={user} onOpen={r=>document.getElementById(`my-${r.section}`)?.scrollIntoView({behavior:'smooth',block:'start'})}/>
      <div id="my-assignments"><WorkshopAssignments participants={[participant]} user={user} onUpdate={(id,update)=>setParticipants(prev=>prev.map(p=>p.id===id?update(p):p))}/>
      </div><div id="my-sessions"><WorkshopSessions batch={personalBatch} participants={[participant]} user={user} onBatch={()=>{}} onUpdate={()=>{}}/>
      </div><div id="my-completion"><WorkshopCompletion participants={[participant]} batches={[personalBatch]} user={user} onUpdate={()=>{}}/></div>
      <div id="my-maintenance"><WorkshopMaintenance participants={[participant]} batch={personalBatch} members={members} user={user} onUpdate={()=>{}}/></div>
      <AssessmentExperienceModal participant={participant} isOpen={isAssessmentOpen} onClose={()=>setIsAssessmentOpen(false)} onSaveProgress={handleSaveAnswersProgress} onComplete={handleProfileComplete}/>
      <CertificateModal participant={selectedParticipantForCertificate} batch={personalBatch} isOpen={isCertificateOpen} onClose={()=>setIsCertificateOpen(false)}/>
    </>:<div className="profile-panel"><h1>Your workshop profile is pending</h1><p className="profile-muted">Ask your PAW Head to link your participant record and workshop.</p></div>}</main></div>;
  }

  return (
    <div className="profile-app profile-dashboard-shell flex flex-col">
      <ProfileHeader language={profileLanguage} onLanguage={setProfileLanguage} onHome={()=>setDashboardTab('progress')}/>{toolbar}{feedback}{accountsModal}

      {/* Main Content Area */}
      <main className="profile-container w-full flex-1">
        <div className="profile-dashboard-heading"><h1>{roleLabels[user.role]} dashboard</h1><p className="profile-muted">Track workshop progress, assignments and attendance according to your assigned position.</p></div>
        <nav className="profile-dashboard-tabs no-print" aria-label="Dashboard sections" role="tablist">{([['progress','Workshop progress'],['assignments','Assignments'],['sessions','Sessions & attendance'],['completion','Completion'],['maintenance','30 / 60 / 90-day follow-ups'],['reports','Test reports'],['participants','Participants'],...(user.role==='PAW_HEAD'?[['questions','Question bank']]:[]),['operations','Workshop operations']] as [DashboardTab | 'progress' | 'assignments' | 'sessions' | 'completion' | 'maintenance',string][]).map(([key,label])=><button role="tab" key={key} aria-selected={dashboardTab===key} onClick={()=>setDashboardTab(key)}>{label}{key==='reports'&&<small>{participants.reduce((total,p)=>total+participantReports(p).length,0)}</small>}{key==='participants'&&<small>{participants.length}</small>}</button>)}</nav>
      <WorkshopReminders participants={participants} batches={batches} user={user} onOpen={r=>{setSelectedBatchId(r.batchId);setDashboardTab(r.section);if(r.section==='progress')setProgressBatchId(r.batchId);}}/>
      {/* Header */}
      {dashboardTab==='operations' && selectedBatch && <Header
        allowNavigation={canManage(user)}
        canCreateBatch={user.role === 'PAW_HEAD'}
        canUseEscalations={canManage(user) || user.role === 'WELCOME_MEMBER'}
        batches={batches}
        selectedBatch={selectedBatch}
        onSelectBatch={setSelectedBatch}
        onOpenNewBatchModal={() => setIsNewBatchOpen(true)}
        onOpenManageTeamModal={user.role === 'PAW_HEAD' ? () => setIsManageTeamOpen(true) : undefined}
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
      />}

        {dashboardTab==='assignments'||dashboardTab==='sessions'||dashboardTab==='completion'||dashboardTab==='maintenance'?<div className="workshop-progress"><section className="profile-panel"><label>Workshop<select value={selectedBatch?.id||''} onChange={e=>setSelectedBatchId(e.target.value)}>{batches.map(b=><option key={b.id} value={b.id}>{b.name} · {b.code}</option>)}</select></label></section>{selectedBatch?dashboardTab==='maintenance'?<WorkshopMaintenance key={selectedBatch.id} participants={batchParticipants} batch={selectedBatch} members={members} user={user} onUpdate={(id,update)=>setParticipants(prev=>prev.map(p=>p.id===id?update(p):p))}/>:dashboardTab==='completion'?<WorkshopCompletion key={selectedBatch.id} participants={batchParticipants} batches={batches} user={user} onUpdate={(id,update)=>setParticipants(prev=>prev.map(p=>p.id===id?update(p):p))}/>:dashboardTab==='assignments'?<WorkshopAssignments key={selectedBatch.id} participants={batchParticipants} user={user} onUpdate={(id,update)=>setParticipants(prev=>prev.map(p=>p.id===id?update(p):p))}/>:<WorkshopSessions key={selectedBatch.id} batch={selectedBatch} participants={batchParticipants} user={user} onBatch={batch=>setBatches(prev=>prev.map(b=>b.id===batch.id?batch:b))} onUpdate={(id,update)=>setParticipants(prev=>prev.map(p=>p.id===id?update(p):p))}/>:<p className="profile-empty">Create a workshop from Workshop progress to get started.</p>}</div>:dashboardTab==='progress'?<WorkshopProgress user={user} onUpdate={(id,update)=>setParticipants(prev=>prev.map(p=>p.id===id?update(p):p))} onNavigate={(batchId,section)=>{setSelectedBatchId(batchId);setDashboardTab(section);}} batches={batches} participants={participants} members={members} leads={leads} selectedId={batches.some(b=>b.id===progressBatchId)?progressBatchId:'ALL'} onSelect={id=>{setProgressBatchId(id);if(id!=='ALL')setSelectedBatchId(id);}} onOperations={()=>setDashboardTab('operations')} onCreate={user.role==='PAW_HEAD'?()=>setIsNewBatchOpen(true):undefined}/>:dashboardTab!=='operations'?<AssessmentDashboard user={user} members={members} participants={participants} tab={dashboardTab} onAssessment={p=>{setSelectedParticipantForAssessment(p);setIsAssessmentOpen(true);}} onChangeMember={(id,parentId)=>setMembers(previous=>previous.map(m=>m.id===id?{...m,parentLeaderId:parentId||undefined}:m))} onAssignParticipant={(id,memberId)=>setParticipants(previous=>previous.map(p=>p.id===id?{...p,assignedWelcomeIclMemberId:memberId}:p))}/>:!selectedBatch?<section className="profile-panel profile-workshop-empty"><h2>{user.role==='PAW_HEAD'?'Create your first workshop':'No workshop assigned yet'}</h2><p className="profile-muted">Reports and the question bank are ready. Add a workshop to manage calling, registrations and follow-ups.</p>{user.role==='PAW_HEAD'?<div className="flex flex-wrap gap-3 mt-5"><button className="profile-button primary" onClick={()=>setIsNewBatchOpen(true)}>Create workshop</button><button className="profile-button" onClick={()=>setIsManageTeamOpen(true)}>Manage team</button></div>:<p className="profile-muted mt-4">Ask your PAW Head to assign your workshop and records.</p>}</section>:<>
        {/* View Switcher based on currentRole */}
        {currentRole === 'PARTICIPANT_VIEW' ? (
          <ParticipantLivePortal key={selectedBatch.id}
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
                <MissionCallingView key={selectedBatch.id}
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
                <WelcomeFollowupView key={selectedBatch.id}
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
        </>}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3.5 px-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto w-full gap-2">
        <span>PAW Operating System • Coach For Life Live Platform</span>

      </footer>

      {/* MODALS */}
      {/* 1. New PAW Batch Modal */}
      {user.role === 'PAW_HEAD' && <NewBatchModal
        isOpen={isNewBatchOpen}
        onClose={() => setIsNewBatchOpen(false)}
        availableMembers={members}
        onBatchCreated={handleBatchCreated}
      />}

      {/* 2. Manage ICL Team Modal */}
      {user.role === 'PAW_HEAD' && <ManageTeamModal
        isOpen={isManageTeamOpen}
        onClose={() => setIsManageTeamOpen(false)}
        members={members}
        onAddMember={handleAddMember}
        onToggleAvailability={handleToggleMemberAvailability}
        onDeleteMember={handleDeleteMember}
      />}

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
      <AssessmentExperienceModal participant={selectedParticipantForAssessment||undefined} isOpen={isAssessmentOpen} onClose={()=>{setIsAssessmentOpen(false);setSelectedParticipantForAssessment(null);}} onSaveProgress={handleSaveAnswersProgress} onComplete={handleProfileComplete}/>

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
