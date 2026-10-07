import {useState} from 'react';
import {Link} from 'react-router-dom';
import {useProfiles} from '../backend/useProfiles';
import {useDocuments} from '../document/DocumentContext';
import {requireBackend} from '../backend/client';
export default function IdentityReviews() {
  const [profiles,setProfiles]=useProfiles();
  const {documents}=useDocuments();
  const [targetId,setTargetId]=useState('');
  const [documentId,setDocumentId]=useState('');
  const [documentRevision,setDocumentRevision]=useState(null);
  const [reason,setReason]=useState('');
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [message,setMessage]=useState('');
  const pending=profiles.filter(profile=>profile.identityStatus==='pending');
  const target=pending.find(profile=>profile.id===targetId);
  const files=documents.filter(document=>document.ownerId===targetId&&document.category==='Identity');
  async function review(decision) {
    if(busy || !target || !documentId) return;
    setBusy(true);setError('');setMessage('');
    try {
      const result=await requireBackend().rpc('review_identity',{target_id:targetId,document_id:documentId,document_revision:documentRevision,decision,reason:reason.trim()});
      if(result.error) throw result.error;
      setProfiles(previous=>previous.map(profile=>profile.id===targetId?{...profile,identityStatus:decision}:profile));
      setTargetId('');setDocumentId('');setReason('');setMessage('Identity decision saved.');
    } catch(problem) {setError(problem.message);}
    finally {setBusy(false);}
  }
  return <main className="admin-page"><div className="admin-container"><h1>Identity review requests</h1><Link to="/ops">Operations dashboard</Link>
    <p>A staff member must inspect the submitted document before recording a decision. No automatic identity approval is performed.</p>
    {error&&<p role="alert">{error}</p>}{message&&<p role="status">{message}</p>}
    <section className="admin-card"><label htmlFor="identity-customer">Pending customer</label><select id="identity-customer" value={targetId} disabled={busy} onChange={event=>{setTargetId(event.target.value);setDocumentId('');setReason('');setMessage('');}}><option value="">Choose a request</option>{pending.map(profile=><option key={profile.id} value={profile.id}>{profile.name} — {profile.email}</option>)}</select>
      {!pending.length&&<p>No pending requests.</p>}
      {target&&<><h2>{target.name}</h2><label htmlFor="identity-document">Document to review</label><select id="identity-document" value={documentId} disabled={busy} onChange={event=>{setDocumentId(event.target.value);setDocumentRevision(files.find(file=>file.id===event.target.value)?.revision ?? null);}}><option value="">Choose a document</option>{files.map(file=><option key={file.id} value={file.id}>{file.name} (version {file.version})</option>)}</select>
        {documentId&&<p><Link to={`/documents/${documentId}`}>Inspect the selected document</Link></p>}
        <label htmlFor="identity-reason">Review reason (required for rejection)</label><textarea id="identity-reason" value={reason} disabled={busy} maxLength={2000} onChange={event=>setReason(event.target.value)}/>
        <button disabled={busy||!documentId} onClick={()=>review('verified')}>Mark verified</button><button disabled={busy||!documentId||!reason.trim()} onClick={()=>review('rejected')}>Reject request</button>
      </>}
    </section></div></main>;
}
