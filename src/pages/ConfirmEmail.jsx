import {useState} from 'react';
import {Link} from 'react-router-dom';
import {requireBackend} from '../backend/client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
export default function ConfirmEmail() {
  const [email,setEmail]=useState('');
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('');
  const [error,setError]=useState('');
  async function resend(event) {
    event.preventDefault();if(busy) return;
    setError('');setMessage('');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {setError('Enter the email address used to register.');return;}
    setBusy(true);
    try {
      const result=await requireBackend().auth.resend({type:'signup',email:email.trim(),options:{emailRedirectTo:`${window.location.origin}/login`}});
      if(result.error) throw result.error;
      setMessage('If this account needs confirmation, a new link has been requested. Check your inbox and spam folder.');
    } catch(problem) {setError(problem.message || 'The confirmation email could not be requested. Please retry later.');}
    finally {setBusy(false);}
  }
  return <><Navbar/><main className="login-page"><section className="login-card"><h1>Confirm your email</h1>
    <p>Open the confirmation link sent when you registered. If you cannot find it or the link expired, request another email below.</p>
    <form className="login-form" onSubmit={resend} noValidate><div className="login-field"><label htmlFor="confirmation-email">Registration email</label><input id="confirmation-email" type="email" autoComplete="email" value={email} onChange={event=>setEmail(event.target.value)} disabled={busy}/></div>
      {error&&<p role="alert">{error}</p>}{message&&<p role="status">{message}</p>}<button className="register-submit" disabled={busy}>{busy?'Requesting…':'Resend confirmation email'}</button>
    </form><p><Link to="/login">Sign in after confirming</Link></p></section></main><Footer/></>;
}
