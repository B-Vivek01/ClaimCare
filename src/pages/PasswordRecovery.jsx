import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { requireBackend } from '../backend/client';
import { useAuth } from '../auth/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PasswordRecovery() {
  const reset = useLocation().pathname === '/reset-password';
  const {user,loading,recovering} = useAuth();
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [confirm,setConfirm] = useState('');
  const [busy,setBusy] = useState(false);
  const [message,setMessage] = useState('');
  const [error,setError] = useState('');
  async function submit(event) {
    event.preventDefault(); if(busy) return;
    setError('');setMessage('');
    if(reset && (!user || !recovering || password.length<8 || password!==confirm)) {setError('Use the recovery link, then enter matching passwords of at least 8 characters.');return;}
    if(!reset && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {setError('Enter a valid email address.');return;}
    setBusy(true);
    try {
      const backend=requireBackend();
      const result=reset ? await backend.auth.updateUser({password}) : await backend.auth.resetPasswordForEmail(email.trim(),{redirectTo:`${window.location.origin}/reset-password`});
      if(result.error) throw result.error;
      if(reset) {
        setPassword('');setConfirm('');
        setMessage('Password updated. Sign in with your new password.');
        const signedOut=await backend.auth.signOut();
        if(signedOut.error) setError('Password updated, but sign-out failed. Please sign out manually.');
      } else setMessage('If an account exists for this email, check your inbox for a recovery link.');
    } catch(problem) {setError(problem.message || 'Recovery is unavailable. Please retry.');}
    finally {setBusy(false);}
  }
  return <><Navbar/><main className="login-page"><section className="login-card">
    <h1>{reset?'Set a new password':'Recover your account'}</h1>
    {reset && !loading && (!user || !recovering) && !message && <p>Open the password recovery link from your email. If it has expired, request another link.</p>}
    <form className="login-form" onSubmit={submit} noValidate>
      {reset ? <><div className="login-field"><label htmlFor="new-password">New password</label><input id="new-password" type="password" autoComplete="new-password" value={password} onChange={event=>setPassword(event.target.value)} minLength={8} required disabled={!recovering || busy}/></div>
        <div className="login-field"><label htmlFor="confirm-password">Confirm password</label><input id="confirm-password" type="password" autoComplete="new-password" value={confirm} onChange={event=>setConfirm(event.target.value)} required disabled={!recovering || busy}/></div></> :
        <div className="login-field"><label htmlFor="recovery-email">Email address</label><input id="recovery-email" type="email" autoComplete="email" value={email} onChange={event=>setEmail(event.target.value)} required/></div>}
      {error && <p role="alert">{error}</p>}{message && <p role="status">{message}</p>}
      <button className="register-submit" disabled={busy || (reset && (!user || !recovering || loading))}>{busy?'Please wait…':reset?'Update password':'Send recovery link'}</button>
    </form><p><Link to="/login">Sign in</Link> · <Link to="/forgot-password">Request another link</Link></p>
  </section></main><Footer/></>;
}
