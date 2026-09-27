import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/ticketUtils';
import { PriorityBadge, StatusBadge } from './Badges';

export default function TicketTable({ tickets, onDelete, compact = false }) {
  return <div className="table-scroll"><table className="ticket-table"><thead><tr><th>Ticket</th><th>Customer</th><th>Subject</th><th>Priority</th><th>Status</th><th>Assignee</th><th>Created</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>
    {tickets.map((ticket) => <tr key={ticket.id}>
      <td><Link className="ticket-id" to={`/tickets/${ticket.id}`}>{ticket.id}</Link></td>
      <td><div className="customer-cell"><span className="avatar">{ticket.customerName?.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><span><strong>{ticket.customerName}</strong><small>{ticket.customerEmail}</small></span></div></td>
      <td className="subject-cell"><Link to={`/tickets/${ticket.id}`}>{ticket.subject}</Link><small>{ticket.category}</small></td>
      <td><PriorityBadge priority={ticket.priority} /></td><td><StatusBadge status={ticket.status} /></td>
      <td><span className="assignee"><span className={`agent-dot agent-${ticket.assignedAgent?.split(' ')[0].toLowerCase()}`} />{ticket.assignedAgent}</span></td><td className="date-cell">{formatDate(ticket.createdAt, { month: 'short', day: 'numeric' })}</td>
      <td><div className="row-actions"><Link aria-label={`View ${ticket.id}`} title="View ticket" to={`/tickets/${ticket.id}`}><Eye size={15} /></Link>{!compact && <Link aria-label={`Edit ${ticket.id}`} title="Edit ticket" to={`/tickets/${ticket.id}/edit`}><Pencil size={15} /></Link>}{!compact && <button aria-label={`Delete ${ticket.id}`} title="Delete ticket" onClick={() => onDelete(ticket)}><Trash2 size={15} /></button>}</div></td>
    </tr>)}
  </tbody></table></div>;
}
