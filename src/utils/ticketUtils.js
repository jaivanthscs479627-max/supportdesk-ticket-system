export const STORAGE_KEY = 'supportdesk-tickets-v1';

export const readTickets = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.every((ticket) => ticket && typeof ticket.id === 'string') ? parsed : null;
  } catch {
    return null;
  }
};

export const formatDate = (value, options = { month: 'short', day: 'numeric', year: 'numeric' }) =>
  value ? new Intl.DateTimeFormat('en', options).format(new Date(value)) : '—';

export const makeTicketId = (tickets) => {
  const highest = tickets.reduce((max, ticket) => {
    const number = Number(ticket.id?.match(/\d+$/)?.[0] || 0);
    return Math.max(max, number);
  }, 1048);
  return `TKT-${highest + 1}`;
};

export const filterTickets = (tickets, { query, status, priority, category }) => {
  const normalizedQuery = query.trim().toLowerCase();
  return tickets.filter((ticket) => {
    const matchesQuery = !normalizedQuery || [ticket.id, ticket.customerName, ticket.customerEmail, ticket.subject]
      .some((value) => value?.toLowerCase().includes(normalizedQuery));
    return matchesQuery && (!status || ticket.status === status) && (!priority || ticket.priority === priority) && (!category || ticket.category === category);
  });
};

export const calculateStats = (tickets) => tickets.reduce((stats, ticket) => {
  stats.total += 1;
  stats[ticket.status] = (stats[ticket.status] || 0) + 1;
  if (ticket.priority === 'High' || ticket.priority === 'Critical') stats.urgent += 1;
  return stats;
}, { total: 0, Open: 0, 'In Progress': 0, Resolved: 0, Closed: 0, urgent: 0 });
