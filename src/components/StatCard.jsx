import { ArrowUpRight, CircleDot, Clock3, CheckCheck, AlertTriangle } from 'lucide-react';

const icons = { total: CircleDot, open: CircleDot, progress: Clock3, resolved: CheckCheck, closed: CircleDot, urgent: AlertTriangle };
export default function StatCard({ label, value, kind, note }) {
  const Icon = icons[kind] || CircleDot;
  return <article className="stat-card"><div className={`stat-icon ${kind}`}><Icon size={18} strokeWidth={1.8} /></div><div className="stat-content"><span className="stat-label">{label}</span><div className="stat-value-row"><strong>{value}</strong>{note && <span className="stat-note"><ArrowUpRight size={13} />{note}</span>}</div></div></article>;
}
