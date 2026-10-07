import { useState } from 'react';
import { useProfiles } from '../backend/useProfiles';
import { usePayment } from './PaymentContext';
export default function InvoiceCreate() {
  const [profiles] = useProfiles();
  const {addInvoice} = usePayment();
  const [form,setForm] = useState({ownerId:'',amount:'',tax:'0',policyId:'',dueDate:''});
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState('');
  const [success,setSuccess] = useState('');
  const change = event => setForm(previous => ({...previous,[event.target.name]:event.target.value}));
  async function submit(event) {
    event.preventDefault(); if (busy) return; setBusy(true); setError(''); setSuccess('');
    try {
      const customer = profiles.find(profile => profile.id===form.ownerId);
      const amount = Math.round(Number(form.amount)*100)/100;
      const tax = Math.round(Number(form.tax)*100)/100;
      if (!customer || !Number.isFinite(amount) || amount<=0 || !Number.isFinite(tax) || tax<0) throw new Error('Choose a customer and valid invoice amounts.');
      const saved = await addInvoice({...form,customer:customer.name || customer.email,amount,tax,total:Math.round((amount+tax)*100)/100});
      if (!saved) throw new Error('Invoice could not be saved.');
      setForm({ownerId:'',amount:'',tax:'0',policyId:'',dueDate:''});
      setSuccess('Invoice saved. It is available in the list below.');
    } catch (issue) { setError(issue.message); }
    finally { setBusy(false); }
  }
  return <section className="payment-card"><h2>Issue a service invoice</h2>{error && <p role="alert">{error}</p>}{success && <p role="status">{success}</p>}<form className="payment-form" onSubmit={submit}><label>Customer<select name="ownerId" value={form.ownerId} onChange={change} required><option value="">Select customer</option>{profiles.filter(item=>item.role==='customer' && item.status==='Active').map(item=><option key={item.id} value={item.id}>{item.name} — {item.email}</option>)}</select></label><label>Service fee (INR)<input name="amount" type="number" min="1" step="0.01" value={form.amount} onChange={change} required /></label><label>Tax amount (INR)<input name="tax" type="number" min="0" step="0.01" value={form.tax} onChange={change} /></label><label>Policy reference<input name="policyId" value={form.policyId} onChange={change} /></label><label>Due date<input name="dueDate" type="date" value={form.dueDate} onChange={change} /></label><button disabled={busy}>{busy?'Saving…':'Issue invoice'}</button></form></section>;
}
