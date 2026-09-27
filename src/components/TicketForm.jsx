import { useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export const categories = ['Technical Issue', 'Billing', 'Account', 'Product', 'General Inquiry'];
export const priorities = ['Low', 'Medium', 'High', 'Critical'];
export const statuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
export const agents = ['Alex Johnson', 'Priya Sharma', 'David Wilson', 'Sarah Thomas'];

const initialValues = { customerName: '', customerEmail: '', subject: '', description: '', category: 'Technical Issue', priority: 'Medium', assignedAgent: 'Alex Johnson', status: 'Open' };
export default function TicketForm({ ticket, onSubmit, submitLabel }) {
  const [form, setForm] = useState(() => ({ ...initialValues, ...ticket }));
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.customerName.trim()) nextErrors.customerName = 'Enter the customer name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail.trim())) nextErrors.customerEmail = 'Enter a valid email address.';
    if (form.subject.trim().length < 5) nextErrors.subject = 'Subject must be at least 5 characters.';
    if (form.description.trim().length < 15) nextErrors.description = 'Description must be at least 15 characters.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setBusy(true);
    await onSubmit({ ...form, customerName: form.customerName.trim(), customerEmail: form.customerEmail.trim(), subject: form.subject.trim(), description: form.description.trim() });
    setBusy(false);
  };

  return <form className="ticket-form" onSubmit={handleSubmit} noValidate>
    <div className="form-heading"><div><span className="eyebrow">{ticket ? 'TICKET DETAILS' : 'NEW REQUEST'}</span><h2>{ticket ? 'Update ticket information' : 'Tell us what’s going on'}</h2><p>Share the details below and our team will take it from here.</p></div></div>
    <div className="form-section"><h3>Customer information</h3><div className="form-grid two-col">
      <Field label="Customer name" name="customerName" value={form.customerName} onChange={update} error={errors.customerName} placeholder="e.g. Olivia Rhye" required />
      <Field label="Email address" name="customerEmail" type="email" value={form.customerEmail} onChange={update} error={errors.customerEmail} placeholder="name@company.com" required />
    </div></div>
    <div className="form-section"><h3>Issue details</h3><div className="form-grid two-col">
      <Field label="Subject" name="subject" value={form.subject} onChange={update} error={errors.subject} placeholder="Briefly describe the issue" required className="span-two" />
      <div className="field span-two"><label htmlFor="description">Description <span className="required">*</span></label><textarea id="description" name="description" rows="5" value={form.description} onChange={update} placeholder="Include any details that will help us resolve your request…" aria-invalid={!!errors.description} />{errors.description && <small className="field-error">{errors.description}</small>}</div>
      <SelectField label="Category" name="category" value={form.category} onChange={update} options={categories} />
      <SelectField label="Priority" name="priority" value={form.priority} onChange={update} options={priorities} />
      <SelectField label="Assigned agent" name="assignedAgent" value={form.assignedAgent} onChange={update} options={agents} />
      {ticket && <SelectField label="Status" name="status" value={form.status} onChange={update} options={statuses} />}
    </div></div>
    <div className="form-actions"><Link to={ticket ? `/tickets/${ticket.id}` : '/tickets'} className="button button-quiet"><ArrowLeft size={16} />Cancel</Link><button className="button button-primary" type="submit" disabled={busy}>{busy ? 'Saving…' : submitLabel}</button></div>
  </form>;
}

function Field({ label, name, value, onChange, error, ...props }) {
  return <div className="field"><label htmlFor={name}>{label} {props.required && <span className="required">*</span>}</label><input id={name} name={name} value={value || ''} onChange={onChange} aria-invalid={!!error} {...props} />{error && <small className="field-error">{error}</small>}</div>;
}
function SelectField({ label, name, value, onChange, options }) {
  return <div className="field"><label htmlFor={name}>{label}</label><div className="select-wrap"><select id={name} name={name} value={value} onChange={onChange}>{options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={15} /></div></div>;
}
