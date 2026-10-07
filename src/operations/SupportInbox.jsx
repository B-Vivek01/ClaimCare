import {useState} from 'react';
import {Link} from 'react-router-dom';
import {useTableRows} from '../backend/useTableRows';
import {requireBackend} from '../backend/client';
export default function SupportInbox() {
  const {rows,loading,error,reload}=useTableRows('support_requests');
  const [selectedId,setSelectedId]=useState('');
  const [status,setStatus]=useState('Open');
  const [note,setNote]=useState('');
  const [busy,setBusy]=useState(false);
  const [saveError,setSaveError]=useState('');
  const [message,setMessage]=useState('');
  const selected=rows.find(row=>row.id===selectedId);
  function select(row) {setSelectedId(row.id);setStatus(row.data.status);setNote(row.data.internalNote || '');setSaveError('');setMessage('');}
  async function save(event) {
    event.preventDefault();if(busy || !selected) return;
    setBusy(true);setSaveError('');setMessage('');
    try {
      const result=await requireBackend().rpc('update_support_request',{ticket_id:selected.id,ticket_status:status,internal_note:note,expected_revision:selected.revision});
      if(result.error) throw result.error;
      setMessage('Ticket update saved.');await reload();
    } catch(problem) {setSaveError(problem.message);}
    finally {setBusy(false);}
  }
  return <main className="admin-page"><div className="admin-container"><h1>Support inbox</h1><Link to="/ops">Operations dashboard</Link>
    <p>Latest 200 website contact requests. Notes are internal; saving does not send an email.</p>
    {loading&&<p>Loading requests…</p>}{error&&<p role="alert">{error}</p>}
    <section className="admin-card"><div className="admin-table-wrapper"><table className="admin-table"><thead><tr><th>Subject</th><th>Contact</th><th>Status</th><th>Received</th><th>Action</th></tr></thead><tbody>
      {rows.map(row=><tr key={row.id}><td>{row.data.subject}</td><td>{row.data.name}<br/>{row.data.email}</td><td>{row.data.status}</td><td>{new Date(row.created_at).toLocaleString()}</td><td><button disabled={busy} onClick={()=>select(row)}>Review</button></td></tr>)}
    </tbody></table></div>{!loading&&!error&&!rows.length&&<p>No support requests yet.</p>}</section>
    {selected&&<section className="admin-card"><h2>{selected.data.subject}</h2><p style={{whiteSpace:'pre-wrap'}}>{selected.data.message}</p><form onSubmit={save}>
      <label htmlFor="ticket-status">Status</label><select id="ticket-status" value={status} onChange={event=>setStatus(event.target.value)} disabled={busy}><option>Open</option><option>In Progress</option><option>Closed</option></select>
      <label htmlFor="ticket-note">Internal note</label><textarea id="ticket-note" value={note} onChange={event=>setNote(event.target.value)} maxLength={5000} disabled={busy}/>
      {saveError&&<p role="alert">{saveError}</p>}{message&&<p role="status">{message}</p>}<button disabled={busy}>{busy?'Saving…':'Save ticket'}</button>
    </form></section>}
  </div></main>;
}
