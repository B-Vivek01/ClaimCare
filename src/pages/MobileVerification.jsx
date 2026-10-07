import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requireBackend } from '../backend/client';
import { auth } from '../backend/auth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
export default function MobileVerification() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [sentPhone, setSentPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function send() {
    setBusy(true); setError('');
    try {
      if (!/^\+[1-9]\d{7,14}$/.test(phone)) throw new Error('Enter your number with country code, for example +919876543210.');
      const { error: issue } = await requireBackend().auth.updateUser({ phone });
      if (issue) throw issue;
      setSentPhone(phone);
    } catch (issue) { setError(issue.message || 'Unable to send SMS. Please retry.'); }
    finally { setBusy(false); }
  }
  async function verify(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      if (!sentPhone || !/^\d{6}$/.test(code)) throw new Error('Send an SMS and enter its six-digit code.');
      const { error: issue } = await requireBackend().auth.verifyOtp({ phone: sentPhone, token: code, type: 'phone_change' });
      if (issue) throw issue;
      navigate('/welcome');
    } catch (issue) { setError(issue.message || 'Invalid or expired code. Please retry.'); }
    finally { setBusy(false); }
  }
  return <><Navbar /><main className="verification-page"><section className="verification-container"><h1>Verify your mobile number</h1>{auth.currentUser?.phoneNumber ? <><p>Your verified number is {auth.currentUser.phoneNumber}.</p><Link to="/dashboard">Continue</Link></> : <><label htmlFor="phone">Mobile number with country code</label><input id="phone" type="tel" value={phone} onChange={event => { setPhone(event.target.value); setSentPhone(''); }} disabled={busy} /><p>Sending a code uses the configured SMS provider.</p><button disabled={busy} onClick={send}>Send SMS code</button>{sentPhone && <form onSubmit={verify}><label htmlFor="sms-code">SMS code</label><input id="sms-code" inputMode="numeric" autoComplete="one-time-code" value={code} maxLength={6} onChange={event => setCode(event.target.value.replace(/\D/g, ''))} /><button disabled={busy}>Verify number</button></form>}</>}{error && <p role="alert" className="verification-error">{error}</p>}<p><Link to="/dashboard">Return to dashboard</Link></p></section></main><Footer /></>;
}
