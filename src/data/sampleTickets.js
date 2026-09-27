const daysAgo = (days, hour = 10) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 15, 0, 0);
  return date.toISOString();
};

export const sampleTickets = [
  { id: 'TKT-1048', customerName: 'Olivia Rhye', customerEmail: 'olivia.rhye@example.com', subject: 'Unable to access my workspace', description: 'I am being redirected to the sign-in page every time I try to open my workspace. I have already reset my password, but the issue continues.', category: 'Technical Issue', priority: 'High', status: 'In Progress', assignedAgent: 'Alex Johnson', createdAt: daysAgo(0, 9), updatedAt: daysAgo(0, 11) },
  { id: 'TKT-1047', customerName: 'Phoenix Baker', customerEmail: 'phoenix.baker@example.com', subject: 'Question about my latest invoice', description: 'Could you please help me understand the additional charge on my latest monthly invoice?', category: 'Billing', priority: 'Medium', status: 'Open', assignedAgent: 'Priya Sharma', createdAt: daysAgo(0, 8), updatedAt: daysAgo(0, 8) },
  { id: 'TKT-1046', customerName: 'Lana Steiner', customerEmail: 'lana.steiner@example.com', subject: 'Update account email address', description: 'I need to update the email address associated with my account. Please let me know what information you need.', category: 'Account', priority: 'Low', status: 'Resolved', assignedAgent: 'David Wilson', createdAt: daysAgo(1, 15), updatedAt: daysAgo(0, 7) },
  { id: 'TKT-1045', customerName: 'Demi Wilkinson', customerEmail: 'demi.wilkinson@example.com', subject: 'Product export is missing fields', description: 'The CSV export does not include the custom fields I selected. This is affecting our weekly reporting.', category: 'Product', priority: 'Critical', status: 'Open', assignedAgent: 'Sarah Thomas', createdAt: daysAgo(1, 13), updatedAt: daysAgo(1, 13) },
  { id: 'TKT-1044', customerName: 'Candice Wu', customerEmail: 'candice.wu@example.com', subject: 'Thank you for the quick help', description: 'Just following up to say the steps you shared fixed my issue. Thank you!', category: 'General Inquiry', priority: 'Low', status: 'Closed', assignedAgent: 'Alex Johnson', createdAt: daysAgo(2, 11), updatedAt: daysAgo(1, 16) },
  { id: 'TKT-1043', customerName: 'Natali Craig', customerEmail: 'natali.craig@example.com', subject: 'Two-factor code not arriving', description: 'I have tried requesting a new verification code several times, but I have not received one yet.', category: 'Technical Issue', priority: 'High', status: 'In Progress', assignedAgent: 'Priya Sharma', createdAt: daysAgo(3, 9), updatedAt: daysAgo(1, 10) },
];
