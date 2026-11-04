export function csvText(rows: unknown[][]) {
  return '\uFEFF' + rows.map(row => row.map(value => {
    const text = String(value ?? '');
    const safe = /^[\s\uFEFF]*[=+@-]/.test(text) ? `'${text}` : text;
    return `"${safe.replace(/"/g, '""')}"`;
  }).join(',')).join('\r\n');
}
export function downloadCSV(rows: unknown[][], filename: string) {
  const csv = csvText(rows);
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.replace(/[\\/:*?"<>|]/g, '_');
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

import { CallingLead, Participant, ICLMember } from '@/types/paw';

export const exportLeadsToCSV = (leads: CallingLead[], members: ICLMember[], batchName: string) => {
  const headers = ['Lead ID', 'Full Name', 'Phone', 'City', 'Calling Member', 'Status', 'Last Remark', 'Next Followup'];
  
  const rows = leads.map((lead) => {
    const member = members.find((m) => m.id === lead.assignedMemberId);
    const lastRemark = lead.callLogs?.[0]?.note || '';
    return [
      lead.id,
      lead.fullName,
      lead.phone,
      lead.city,
      member?.name || '-',
      lead.callStatus,
      lastRemark,
      lead.nextFollowupDate || '-',
    ];
  });

  downloadCSV([headers, ...rows], `PAW_Calling_Leads_${batchName.replace(/\s+/g, '_')}.csv`);
};

export const exportParticipantsToCSV = (participants: Participant[], members: ICLMember[], batchName: string) => {
  const headers = [
    'Login ID', 
    'Full Name', 
    'Phone', 
    'WhatsApp', 
    'Preferred Language', 
    'City', 
    'Registered Date',
    'WhatsApp Group', 
    'Assigned Welcome ICL Member', 
    'Welcome Call Status', 
    'First Assignment Status',
    'Personality Type'
  ];

  const rows = participants.map((p) => {
    const member = members.find((m) => m.id === p.assignedWelcomeIclMemberId);
    return [
      p.loginId,
      p.fullName,
      p.phone,
      p.whatsappNumber,
      p.preferredLanguage.toUpperCase(),
      p.city,
      p.registeredAt,
      p.whatsappGroupJoined ? 'Joined' : 'Pending',
      member?.name || '-',
      p.welcomeCallStatus,
      p.firstAssignmentStatus,
      p.personalityType || 'Pending',
    ];
  });

  downloadCSV([headers, ...rows], `PAW_Participants_${batchName.replace(/\s+/g, '_')}.csv`);
};
