import { Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function EmptyState({ title = 'No tickets yet', message = 'Create a ticket to start keeping every customer request in one place.' }) {
  return <div className="empty-state"><span className="empty-icon"><Inbox size={24} /></span><h3>{title}</h3><p>{message}</p><Link to="/tickets/new" className="button button-primary">Create a ticket</Link></div>;
}
