import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requireBackend } from '../backend/client';
import { auth } from '../backend/auth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
export default function EmailVerification() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  async function act(check) {
    setBusy(true); setError(''); setMessage('');
    try {
      const backend = requireBackend();
      if (!auth.currentUser) throw new Error('Please sign in first.');
      if (check) {
        const { data, error: issue } = await backend.auth.getUser();
        if (issue) throw issue;
        if (!data.user?.email_confirmed_at) throw new Error('Open the verification link in your email, then check again.');
        navigate('/verify-mobile');
      } else {
        const { error: issue } = await backend.auth.resend({ type: 'signup', email: auth.currentUser.email, options: { emailRedirectTo: window.location.origin + '/login' } });
        if (issue) throw issue;
        setMessage('Verification email sent. Open its link, then return here.');
      }
    } catch (issue) { setError(issue.message || 'Verification failed. Please retry.'); }
    finally { setBusy(false); }
  }
  return <><Navbar /><main className="verification-page"><section className="verification-container"><h1>Verify your email</h1><p>Confirm {auth.currentUser?.email} using the link sent by Supabase.</p>{error && <p role="alert" className="verification-error">{error}</p>}{message && <p role="status">{message}</p>}<button className="verification-primary-btn" disabled={busy} onClick={() => act(true)}>I have verified my email</button><button disabled={busy} onClick={() => act(false)}>Send verification email</button><p><Link to="/dashboard">Return to dashboard</Link></p></section></main><Footer /></>;
}
