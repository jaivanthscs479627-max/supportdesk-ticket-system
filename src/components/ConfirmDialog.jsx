import { AlertTriangle, X } from 'lucide-react';
export default function ConfirmDialog({ ticket, onCancel, onConfirm }) {
  if (!ticket) return null;
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}><section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="dialog-title"><button className="modal-close" aria-label="Close dialog" onClick={onCancel}><X size={18} /></button><span className="confirm-icon"><AlertTriangle size={21} /></span><h2 id="dialog-title">Delete this ticket?</h2><p><strong>{ticket.id}</strong> · {ticket.subject}<br />This ticket will be permanently removed from your workspace.</p><div className="form-actions"><button className="button button-quiet" onClick={onCancel}>Cancel</button><button className="button button-danger" onClick={() => onConfirm(ticket.id)}>Delete ticket</button></div></section></div>;
}
