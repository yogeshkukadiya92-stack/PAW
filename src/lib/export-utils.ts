import { CallingLead, Participant, ICLMember } from '@/types/paw';

export const exportLeadsToCSV = (leads: CallingLead[], members: ICLMember[], batchName: string) => {
  const headers = ['Lead ID', 'Full Name', 'Phone', 'City', 'Calling Member', 'Status', 'Last Remark', 'Next Followup'];
  
  const rows = leads.map((lead) => {
    const member = members.find((m) => m.id === lead.assignedMemberId);
    const lastRemark = lead.callLogs?.[0]?.note || '';
    return [
      lead.id,
      `"${lead.fullName.replace(/"/g, '""')}"`,
      lead.phone,
      `"${lead.city}"`,
      `"${member?.name || '-'}"`,
      lead.callStatus,
      `"${lastRemark.replace(/"/g, '""')}"`,
      lead.nextFollowupDate || '-',
    ];
  });

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `PAW_Calling_Leads_${batchName.replace(/\s+/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
      `"${p.fullName.replace(/"/g, '""')}"`,
      p.phone,
      p.whatsappNumber,
      p.preferredLanguage.toUpperCase(),
      `"${p.city}"`,
      p.registeredAt,
      p.whatsappGroupJoined ? 'Joined' : 'Pending',
      `"${member?.name || '-'}"`,
      p.welcomeCallStatus,
      p.firstAssignmentStatus,
      `"${p.personalityType || 'Pending'}"`,
    ];
  });

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `PAW_Participants_${batchName.replace(/\s+/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
