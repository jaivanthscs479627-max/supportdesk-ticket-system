export function StatusBadge({ status }) {
  return <span className={`badge status-${status?.toLowerCase().replaceAll(' ', '-') || 'open'}`}><span className="badge-dot" />{status || 'Open'}</span>;
}

export function PriorityBadge({ priority }) {
  return <span className={`priority priority-${priority?.toLowerCase() || 'low'}`}><span className="priority-icon">{priority === 'Critical' ? '↑' : priority === 'High' ? '↗' : priority === 'Medium' ? '→' : '↓'}</span>{priority}</span>;
}
