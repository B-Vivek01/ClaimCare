import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useDocuments } from '../document/DocumentContext';
import { requireBackend } from '../backend/client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
export default function IdentityVerification() {
  const {profile}=useAuth();
  const {addDocuments}=useDocuments();
  const [file,setFile]=useState(null);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [submitted,setSubmitted]=useState(false);
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      if (!file) throw new Error('Choose an identity document.');
      await addDocuments([file],null,'Identity');
      const {error:issue}=await requireBackend().rpc('request_identity_review');
      if (issue) throw issue;
      setSubmitted(true);
    } catch (issue) {setError(issue.message || 'Verification request failed.');}
    finally {setBusy(false);}
  }
  const status=submitted?'pending':profile?.identityStatus || 'incomplete';
  return <><Navbar/><main className="identity-verification-page"><div className="identity-verification-container"><h1>Identity verification</h1><p>Status: {status}</p><p>Upload a supported identity document for a human review. Uploading a file does not automatically verify your identity.</p>{error&&<p role="alert">{error}</p>}{status!=='verified'&&<form onSubmit={submit}><label htmlFor="identity-file">Identity document (PDF or image, up to 10 MB)</label><input id="identity-file" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" onChange={event=>setFile(event.target.files?.[0] || null)} disabled={busy}/><button disabled={busy || !file}>{busy?'Uploading…':'Request identity review'}</button></form>}<p><Link to="/documents">View uploaded documents</Link></p><Link to="/dashboard">Return to dashboard</Link></div></main><Footer/></>;
}
