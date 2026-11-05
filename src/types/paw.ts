export type WorkshopType = 'Online' | 'Offline';

export type PAWBatchStatus = 'Draft' | 'Calling' | 'Welcome' | 'Active' | 'Completed';

export type UserRole = 
  | 'PAW_HEAD' 
  | 'LEADER_HEAD' 
  | 'LEADER' 
  | 'CALLING_MEMBER' 
  | 'WELCOME_MEMBER';

export type CallingCapacity = 15 | 25 | 35;

export type PreferredLanguage = 'en' | 'gu' | 'hi' | 'mr';

export interface PAWBatch {
  cflWorkshopId?: string;
  sessions?: WorkshopSession[];
  id: string;
  name: string;
  code: string;
  type: WorkshopType;
  venueOrLink: string;
  startDate: string;
  endDate: string;
  welcomeStartDate: string; // Typically T-7 days
  pawHeadId: string;
  status: PAWBatchStatus;
  totalTargetRegistrations: number;
  createdAt: string;
}

export interface ICLMember {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  team: 'CALLING' | 'WELCOME_FOLLOWUP' | 'LEADERSHIP';
  callingCapacity?: CallingCapacity;
  parentLeaderId?: string;
  isAvailable: boolean;
  avatarUrl?: string;
}

export type CallStatus = 
  | 'PENDING' 
  | 'INTERESTED' 
  | 'CALLBACK_REQUESTED' 
  | 'NOT_REACHABLE' 
  | 'NOT_INTERESTED' 
  | 'REGISTERED';

export interface CallLogEntry {
  id: string;
  timestamp: string;
  status: CallStatus;
  note: string;
  callbackDate?: string;
}

export interface CallingLead {
  id: string;
  pawBatchId: string;
  fullName: string;
  phone: string;
  city: string;
  assignedMemberId: string;
  callStatus: CallStatus;
  callLogs: CallLogEntry[];
  lastCalledAt?: string;
  nextFollowupDate?: string;
}

export type AssignmentStatus = 
  | 'Not_Started' 
  | 'Basic_Completed' 
  | 'In_Progress' 
  | 'Submitted' 
  | 'Report_Generated';

export interface WelcomeChecklist {
  verified: boolean;
  datesConfirmed: boolean;
  whatsappConfirmed: boolean;
  firstAssignmentGuided: boolean;
  techSupportProvided: boolean;
  doubtsCleared: boolean;
  attendanceConfirmed: boolean;
  remarks?: string;
}

export interface DailyFollowupLog {
  id: string;
  date: string;
  sessionNumber: number;
  attended: boolean;
  assignmentCompleted: boolean;
  supportRequired: 'None' | 'Technical' | 'Conceptual' | 'Personal' | 'Other';
  iclRemark: string;
  escalatedToLeader: boolean;
}

export interface Participant {
  cflWorkshopId?: string;
  cflRegistrationId?: string;
  cflRegistrationIds?: string[];
  cflRegistrationNumber?: string;
  cflRegistrationStatus?: string;
  maintenanceEvents?: MaintenanceEvent[];
  completionEvents?: CompletionEvent[];
  interventionEvents?: InterventionEvent[];
  assignments?: WorkshopAssignment[];
  sessionAttendance?: SessionAttendance[];
  assessmentReports?: import('@/lib/assessment').AssessmentReport[];
  id: string;
  loginId: string;
  pawBatchId: string;
  fullName: string;
  phone: string;
  whatsappNumber: string;
  preferredLanguage: PreferredLanguage;
  city: string;
  registeredAt: string;
  registrationStatus: 'Confirmed' | 'Payment_Verified' | 'Provisional';
  whatsappGroupJoined: boolean;
  
  // Calling handover tracking
  assignedCallingMemberId?: string;
  
  // 1:1 Welcome & During-PAW Follow-up ownership
  assignedWelcomeIclMemberId: string;
  
  // Welcome Call (T-7)
  welcomeCallStatus: 'Pending' | 'Completed' | 'Callback_Required' | 'Unreachable';
  welcomeChecklist: WelcomeChecklist;
  
  // 40 Questions Assessment
  firstAssignmentStatus: AssignmentStatus;
  personalityReportUrl?: string;
  personalityType?: string;
  email?: string;
  assessmentAnswers?: Record<number, string>;
  temperamentScores?: {
    Sanguine: { strengths: number; weaknesses: number; total: number };
    Choleric: { strengths: number; weaknesses: number; total: number };
    Melancholy: { strengths: number; weaknesses: number; total: number };
    Phlegmatic: { strengths: number; weaknesses: number; total: number };
  };
  dominantTemperament?: string;
  secondaryTemperament?: string;
  
  // During PAW tracking
  followups: DailyFollowupLog[];
}


export interface AssignmentEvent {
  id: string;
  action: 'Submitted' | 'Approved' | 'Changes_Requested';
  answer: string;
  link: string;
  note: string;
  at: string;
  by: string;
}
export interface WorkshopAssignment {
  id: string;
  title: string;
  instructions: string;
  dueDate: string;
  history: AssignmentEvent[];
}
export interface WorkshopSession {
  id: string;
  title: string;
  startsAt: string;
  link: string;
}
export interface SessionAttendance {
  sessionId: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  note: string;
  updatedAt: string;
  updatedBy: string;
}

export interface InterventionEvent {
  id: string;
  action: 'Opened' | 'Note' | 'Resolved';
  note: string;
  nextFollowupDate: string;
  at: string;
  by: string;
}

export interface CompletionEvent {
  id: string;
  action: 'Completed' | 'Reopened';
  note: string;
  at: string;
  by: string;
}

export interface MaintenanceEvent {
  id: string;
  day: number;
  outcome: 'Completed' | 'Unreachable' | 'Support_Required' | 'Rescheduled';
  note: string;
  nextFollowupDate: string;
  at: string;
  by: string;
}
