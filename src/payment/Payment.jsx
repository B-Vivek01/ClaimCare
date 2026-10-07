import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePayment } from './PaymentContext';
import { useAuth } from '../auth/AuthContext';
export default function Payment() {
  const paymentsEnabled = import.meta.env.VITE_PAYMENTS_ENABLED === 'true';
  const {invoices,processPayment} = usePayment();
  const {user}=useAuth();
  const [invoiceId,setInvoiceId] = useState('');
  const [busy,setBusy] = useState(false);
  const [message,setMessage] = useState('');
  const [error,setError] = useState('');
  const unpaid = invoices.filter(invoice => invoice.status === 'Pending' && invoice.ownerId===user?.uid);
  const selected = unpaid.find(invoice => invoice.id === invoiceId);
  async function submit(event) {
    event.preventDefault(); if (busy || !paymentsEnabled) return;
    setBusy(true); setError(''); setMessage('');
    try {
      if (!selected) throw new Error('Choose an unpaid invoice.');
      const result = await processPayment(invoiceId);
      setMessage(`Test payment verified: ${result.paymentId}. No live payment was taken.`);
    } catch (issue) { setError(issue.message || 'Payment failed.'); }
    finally { setBusy(false); }
  }
  return <main className="payment-page"><div className="payment-container"><div className="payment-header"><h1>Pay a service invoice</h1><Link to="/payments">Payment dashboard</Link></div><section className="payment-card"><p>{paymentsEnabled ? "Razorpay test mode. Pay only invoices issued by ClaimCare staff." : "Online payment setup is pending. Your invoice remains unpaid until a verified payment is recorded."}</p>{error && <p role="alert">{error}</p>}{message && <p role="status">{message}</p>}<form className="payment-form" onSubmit={submit}><label htmlFor="invoice">Invoice</label><select id="invoice" value={invoiceId} onChange={event => setInvoiceId(event.target.value)} disabled={busy}><option value="">Choose an invoice</option>{unpaid.map(invoice => <option key={invoice.id} value={invoice.id}>{invoice.id} — ₹{Number(invoice.total).toFixed(2)}</option>)}</select>{selected && <p>Total: ₹{Number(selected.total).toFixed(2)}</p>}<button className="payment-primary-button" disabled={!paymentsEnabled || busy || !selected}>{busy ? 'Opening checkout…' : 'Pay with Razorpay test checkout'}</button></form>{!unpaid.length && <p>No unpaid invoices. Staff can issue an invoice for your service.</p>}</section></div></main>;
}
