import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Activity, ArrowDownUp, ArrowLeft, Bell, ChevronDown, CircleHelp, ClipboardList, Command, LayoutDashboard, Plus, Search, Settings2, Sparkles, Ticket, TicketCheck, Trash2 } from 'lucide-react';
import { sampleTickets } from './data/sampleTickets';
import TicketForm, { categories, priorities, statuses } from './components/TicketForm';
import TicketTable from './components/TicketTable';
import StatCard from './components/StatCard';
import EmptyState from './components/EmptyState';
import ConfirmDialog from './components/ConfirmDialog';
import { PriorityBadge, StatusBadge } from './components/Badges';
import { calculateStats, filterTickets, formatDate, makeTicketId, readTickets, STORAGE_KEY } from './utils/ticketUtils';

export default function App() {
  const [tickets, setTickets] = useState(() => readTickets() ?? sampleTickets);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets)); }, [tickets]);
  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        navigate('/tickets?focus=1');
        window.setTimeout(() => document.querySelector('[aria-label="Search tickets"]')?.focus(), 0);
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [navigate]);
  useEffect(() => {
    if (location.state?.notice) {
      setToast(location.state.notice);
      navigate(`${location.pathname}${location.search}`, { replace: true, state: null });
      const timer = window.setTimeout(() => setToast(''), 3200);
      return () => window.clearTimeout(timer);
    }
  }, [location.key, location.pathname, location.search, location.state, navigate]);

  const createTicket = (data) => {
    const now = new Date().toISOString();
    const ticket = { ...data, id: makeTicketId(tickets), createdAt: now, updatedAt: now };
    setTickets((current) => [ticket, ...current]);
    navigate(`/tickets/${ticket.id}`, { state: { notice: 'Ticket created successfully.' } });
  };
  const updateTicket = (id, data) => {
    const now = new Date().toISOString();
    setTickets((current) => current.map((ticket) => ticket.id === id ? { ...ticket, ...data, updatedAt: now } : ticket));
    navigate(`/tickets/${id}`, { state: { notice: 'Ticket updated successfully.' } });
  };
  const deleteTicket = (id) => {
    const exists = tickets.some((ticket) => ticket.id === id);
    if (!exists) { setDeleteTarget(null); setToast('This ticket could not be found.'); return; }
    setTickets((current) => current.filter((ticket) => ticket.id !== id));
    setDeleteTarget(null);
    if (location.pathname.includes(id)) navigate('/tickets', { state: { notice: 'Ticket deleted.' } });
    else setToast('Ticket deleted.');
  };
  const changeStatus = (id, status) => updateTicket(id, { status });

  return <div className="app-shell">
    <aside className="sidebar">
      <Link className="brand" to="/" aria-label="SupportDesk home"><span className="brand-mark"><TicketCheck size={20} strokeWidth={2.3} /></span><span>support<span className="brand-light">desk</span><small>HELP CENTER</small></span></Link>
      <div className="workspace-switch"><span className="workspace-avatar">S</span><span className="workspace-name"><strong>Studio North</strong><small>Free workspace</small></span><ChevronDown size={15} /></div>
      <div className="nav-label">WORKSPACE</div>
      <nav className="primary-nav" aria-label="Main navigation">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><LayoutDashboard size={18} />Dashboard</NavLink>
        <NavLink to="/tickets" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><ClipboardList size={18} />All tickets<span className="nav-count">{tickets.length}</span></NavLink>
        <NavLink to="/tickets/new" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><Plus size={18} />Create ticket</NavLink>
      </nav>
      <div className="nav-label tools-label">TOOLS</div><nav className="primary-nav"><button className="nav-link" onClick={() => setToast('You’re all caught up.')}><Activity size={18} />Activity</button><button className="nav-link" onClick={() => setToast('Settings are coming soon.')}><Settings2 size={18} />Settings</button></nav>
      <div className="sidebar-bottom"><div className="upgrade-card"><span className="upgrade-art"><Sparkles size={16} /></span><strong>Make support feel effortless.</strong><p>Everything your team needs to keep customers happy.</p><button onClick={() => setToast('You’re already using SupportDesk Free.')}>Explore workspace <span>↗</span></button></div><button className="help-link" onClick={() => setToast('Need help? Email support@supportdesk.local')}><CircleHelp size={17} />Help & support</button><div className="profile"><span className="profile-avatar">JD</span><span><strong>Jamie Doe</strong><small>Admin</small></span><MoreIcon /></div></div>
    </aside>
    <main className="main-area"><header className="topbar"><div className="mobile-brand"><span className="brand-mark"><TicketCheck size={18} /></span>SupportDesk</div><div className="breadcrumb"><span>Workspace</span><span className="crumb-divider">/</span><strong>{pageName(location.pathname)}</strong></div><div className="topbar-actions"><button className="top-search" onClick={() => { navigate('/tickets?focus=1'); window.setTimeout(() => document.querySelector('[aria-label="Search tickets"]')?.focus(), 0); }}><Search size={16} /><span>Search anything...</span><kbd>⌘ K</kbd></button><button className="icon-button notification" aria-label="Notifications" onClick={() => setToast('You’re all caught up.')}><Bell size={18} /><i /></button><span className="topbar-avatar">JD</span></div></header>
      <div className="mobile-nav"><NavLink to="/" end><LayoutDashboard size={16} />Overview</NavLink><NavLink to="/tickets"><ClipboardList size={16} />Tickets</NavLink><NavLink to="/tickets/new"><Plus size={16} />New ticket</NavLink></div>
      <Routes>
        <Route path="/" element={<Dashboard tickets={tickets} onDelete={setDeleteTarget} />} />
        <Route path="/tickets" element={<TicketsPage tickets={tickets} onDelete={setDeleteTarget} />} />
        <Route path="/tickets/new" element={<FormPage onSubmit={createTicket} />} />
        <Route path="/tickets/:id/edit" element={<EditPage tickets={tickets} onSubmit={updateTicket} />} />
        <Route path="/tickets/:id" element={<DetailsPage tickets={tickets} onDelete={setDeleteTarget} onStatusChange={changeStatus} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <footer className="app-footer"><span>© {new Date().getFullYear()} SupportDesk, Inc.</span><span>Built for better conversations <span className="footer-heart">♥</span></span><span>Privacy&nbsp;&nbsp; · &nbsp;&nbsp;Terms</span></footer>
    </main>
    <ConfirmDialog ticket={deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={deleteTicket} />
    {toast && <div className="toast" role="status"><span className="toast-check">✓</span>{toast}<button aria-label="Dismiss notification" onClick={() => setToast('')}>×</button></div>}
  </div>;
}

function MoreIcon() { return <Command size={14} className="profile-more" />; }
function pageName(path) { if (path.endsWith('/new')) return 'Create ticket'; if (path.endsWith('/edit')) return 'Edit ticket'; if (path === '/tickets') return 'Tickets'; if (path.startsWith('/tickets/')) return 'Ticket details'; return 'Dashboard'; }

function Dashboard({ tickets, onDelete }) {
  const stats = calculateStats(tickets);
  const recent = [...tickets].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5);
  return <div className="page-content dashboard-page"><div className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-dot" />{new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(new Date()).toUpperCase()}</div><h1>Good morning, Jamie <span className="wave">✳</span></h1><p>Here’s what’s happening with your support inbox today.</p></div><Link to="/tickets/new" className="button button-primary"><Plus size={17} />Create ticket</Link></div>
    <section className="stats-grid" aria-label="Ticket statistics"><StatCard kind="total" label="Total tickets" value={stats.total} note="All time" /><StatCard kind="open" label="Open tickets" value={stats.Open} /><StatCard kind="progress" label="In progress" value={stats['In Progress']} /><StatCard kind="resolved" label="Resolved" value={stats.Resolved} /><StatCard kind="closed" label="Closed" value={stats.Closed} /><StatCard kind="urgent" label="High priority" value={stats.urgent} /></section>
    <section className="dashboard-panel"><div className="panel-heading"><div><h2>Recent tickets</h2><p>Your latest customer conversations</p></div><Link to="/tickets" className="text-link">View all tickets <span>→</span></Link></div>{recent.length ? <TicketTable tickets={recent} compact onDelete={onDelete} /> : <EmptyState />}</section>
    <section className="bottom-insight"><div className="insight-icon"><Sparkles size={19} /></div><div><strong>Good support starts with a clear picture.</strong><p>Keep an eye on your open tickets and follow up before customers have to ask.</p></div><Link to="/tickets?status=Open" className="text-link">Review open tickets <span>→</span></Link></section>
  </div>;
}

function TicketsPage({ tickets, onDelete }) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchRef = useRef(null);
  const [filters, setFilters] = useState({ query: '', status: params.get('status') || '', priority: '', category: '' });
  const [sort, setSort] = useState('newest');
  useEffect(() => { if (params.get('focus') === '1') searchRef.current?.focus(); }, [location.search]);
  const visible = useMemo(() => {
    const result = filterTickets(tickets, filters);
    if (sort === 'oldest') return [...result].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sort === 'priority') return [...result].sort((a, b) => priorities.indexOf(b.priority) - priorities.indexOf(a.priority));
    return [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [tickets, filters, sort]);
  const update = (name, value) => setFilters((current) => ({ ...current, [name]: value }));
  const hasFilters = Object.values(filters).some(Boolean);
  return <div className="page-content tickets-page"><div className="page-title-row"><div><div className="eyebrow">SUPPORT INBOX</div><h1>All tickets</h1><p>Manage, prioritize, and keep every conversation moving.</p></div><Link to="/tickets/new" className="button button-primary"><Plus size={17} />Create ticket</Link></div>
    <section className="ticket-list-panel"><div className="list-toolbar"><div className="search-input"><Search size={17} /><input ref={searchRef} aria-label="Search tickets" placeholder="Search by name, email, subject or ID..." value={filters.query} onChange={(e) => update('query', e.target.value)} /><kbd>⌘ K</kbd></div><div className="toolbar-controls"><FilterSelect label="Status" value={filters.status} options={statuses} onChange={(v) => update('status', v)} /><FilterSelect label="Priority" value={filters.priority} options={priorities} onChange={(v) => update('priority', v)} /><FilterSelect label="Category" value={filters.category} options={categories} onChange={(v) => update('category', v)} /><span className="toolbar-divider" /><label className="sort-control"><ArrowDownUp size={15} /><select aria-label="Sort tickets" value={sort} onChange={(e) => setSort(e.target.value)}><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="priority">Priority</option></select><ChevronDown size={13} /></label></div></div>
      {hasFilters && <div className="filter-meta"><span>{visible.length} {visible.length === 1 ? 'ticket' : 'tickets'} found</span><button onClick={() => setFilters({ query: '', status: '', priority: '', category: '' })}>Clear filters</button></div>}
      {visible.length ? <TicketTable tickets={visible} onDelete={onDelete} /> : <div className="filtered-empty"><span className="empty-icon"><Search size={22} /></span><h3>{tickets.length ? 'No tickets match your search' : 'Your inbox is clear'}</h3><p>{tickets.length ? 'Try another search or adjust the filters.' : 'New customer requests will appear here.'}</p>{tickets.length ? <button className="button button-quiet" onClick={() => setFilters({ query: '', status: '', priority: '', category: '' })}>Clear all filters</button> : <Link to="/tickets/new" className="button button-primary"><Plus size={16} />Create a ticket</Link>}</div>}
      <div className="table-footer"><span>Showing <strong>{visible.length ? 1 : 0}–{visible.length}</strong> of <strong>{tickets.length}</strong> tickets</span><div className="pagination"><button disabled>Previous</button><button className="current-page">1</button><button disabled>Next</button></div></div>
    </section></div>;
}
function FilterSelect({ label, value, options, onChange }) { return <label className={`filter-select ${value ? 'selected' : ''}`}><span className="sr-only">Filter by {label}</span><select value={value} onChange={(e) => onChange(e.target.value)}><option value="">{label}</option>{options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={13} /></label>; }

function FormPage({ onSubmit }) { return <div className="page-content form-page"><Link to="/tickets" className="back-link"><ArrowLeft size={15} />Back to tickets</Link><div className="form-layout"><div className="form-aside"><span className="aside-icon"><Ticket size={20} /></span><h1>Create a ticket</h1><p>Every great customer experience starts with listening. Tell us what your customer needs help with.</p><div className="aside-note"><span>✦</span><p>Clear details help us get the right answer to your customer faster.</p></div></div><TicketForm onSubmit={onSubmit} submitLabel="Create ticket" /></div></div>; }
function EditPage({ tickets, onSubmit }) { const { id } = useParams(); const ticket = tickets.find((item) => item.id === id); if (!ticket) return <NotFoundTicket />; return <div className="page-content form-page"><Link to={`/tickets/${id}`} className="back-link"><ArrowLeft size={15} />Back to ticket</Link><div className="form-layout"><div className="form-aside"><span className="aside-icon"><Ticket size={20} /></span><h1>Edit ticket</h1><p>Update the customer details, issue information, priority, or ticket status.</p><div className="aside-note"><span>✦</span><p>Ticket changes are saved automatically to this browser.</p></div></div><TicketForm ticket={ticket} onSubmit={(data) => onSubmit(id, data)} submitLabel="Save changes" /></div></div>; }
function DetailsPage({ tickets, onDelete, onStatusChange }) {
  const { id } = useParams(); const ticket = tickets.find((item) => item.id === id); const navigate = useNavigate();
  if (!ticket) return <NotFoundTicket />;
  return <div className="page-content details-page"><Link to="/tickets" className="back-link"><ArrowLeft size={15} />Back to tickets</Link><div className="details-title"><div><div className="eyebrow">{ticket.id} <span className="crumb-divider">·</span> CREATED {formatDate(ticket.createdAt).toUpperCase()}</div><h1>{ticket.subject}</h1><p>Customer support request</p></div><div className="details-actions"><button className="button button-quiet" onClick={() => onDelete(ticket)}><Trash2 size={16} />Delete</button><Link to={`/tickets/${id}/edit`} className="button button-primary"><PencilIcon />Edit ticket</Link></div></div>
    <div className="details-grid"><section className="detail-main"><article className="detail-card"><div className="detail-card-heading"><div className="detail-customer"><span className="avatar large">{ticket.customerName.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><div><strong>{ticket.customerName}</strong><a href={`mailto:${ticket.customerEmail}`}>{ticket.customerEmail}</a></div></div><button className="small-more" aria-label="More actions" onClick={() => onDelete(ticket)}>···</button></div><div className="description-block"><div className="eyebrow">DESCRIPTION</div><p>{ticket.description}</p></div><div className="detail-meta"><span>Created {formatDate(ticket.createdAt, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</span><span>Last updated {formatDate(ticket.updatedAt, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</span></div></article><article className="activity-card"><div className="panel-heading"><div><h2>Activity</h2><p>Updates on this conversation</p></div></div><div className="activity-item"><span className="activity-avatar">{ticket.assignedAgent.split(' ').map((part) => part[0]).join('')}</span><div><p><strong>{ticket.assignedAgent}</strong> updated this ticket.</p><small>{formatDate(ticket.updatedAt, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</small></div></div><div className="activity-item"><span className="activity-avatar customer-activity">{ticket.customerName.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><div><p><strong>{ticket.customerName}</strong> created this ticket.</p><small>{formatDate(ticket.createdAt, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</small></div></div></article></section>
      <aside className="detail-sidebar"><article className="properties-card"><h2>Ticket properties</h2><Property label="Status"><label className="status-select"><StatusBadge status={ticket.status} /><select aria-label="Update ticket status" value={ticket.status} onChange={(e) => onStatusChange(id, e.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select><ChevronDown size={13} /></label></Property><Property label="Priority"><PriorityBadge priority={ticket.priority} /></Property><Property label="Category"><span className="category-value">{ticket.category}</span></Property><Property label="Assigned to"><span className="assignee"><span className={`agent-dot agent-${ticket.assignedAgent.split(' ')[0].toLowerCase()}`} />{ticket.assignedAgent}</span></Property><Property label="Ticket ID"><span className="id-value">{ticket.id}</span></Property></article><div className="detail-tip"><Sparkles size={16} /><p>Keep your customer in the loop as you make progress. A quick update goes a long way.</p></div></aside></div></div>;
}
function Property({ label, children }) { return <div className="property"><span>{label}</span>{children}</div>; }
function PencilIcon() { return <span className="pencil-symbol">↗</span>; }
function NotFoundTicket() { return <div className="page-content"><div className="not-found"><span className="empty-icon"><Ticket size={22} /></span><h1>Ticket not found</h1><p>It may have been deleted or the link may be incorrect.</p><Link to="/tickets" className="button button-primary">Back to tickets</Link></div></div>; }
