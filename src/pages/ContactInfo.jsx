import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { requireBackend } from '../backend/client';
import { updateDoc } from '../backend/profiles';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
export default function ContactInfo() {
  const {user,profile}=useAuth();
  const [email,setEmail]=useState(user?.email || '');
  const [mobile,setMobile]=useState(profile?.mobile || '');
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('');
  const [error,setError]=useState('');
  async function save(event) {
    event.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      if (!/^\+?[0-9\s()-]{7,20}$/.test(mobile)) throw new Error('Enter a valid contact mobile number.');
      await updateDoc({id:user.uid},{mobile:mobile.trim()});
      if (email.trim()!==user.email) {
        const {error:issue}=await requireBackend().auth.updateUser({email:email.trim()},{emailRedirectTo:window.location.origin+'/profile/contact'});
        if (issue) throw issue;
        setMessage('Contact mobile saved. Confirm the email change using the links sent by Supabase; your sign-in email changes after confirmation.');
      } else setMessage('Contact information saved.');
    } catch (issue) {setError(issue.message || 'Unable to save contact information.');}
    finally {setBusy(false);}
  }
  return <><Navbar/><main className="contact-information-page"><div className="contact-information-container"><h1>Contact information</h1>{error&&<p role="alert">{error}</p>}{message&&<p role="status">{message}</p>}<form onSubmit={save}><label htmlFor="contact-email">Sign-in email</label><input id="contact-email" type="email" value={email} onChange={event=>setEmail(event.target.value)} required/><label htmlFor="contact-mobile">Contact mobile</label><input id="contact-mobile" type="tel" value={mobile} onChange={event=>setMobile(event.target.value)} required/><p>Saving a contact number does not verify it.</p><button className="contact-save-button" disabled={busy}>{busy?'Saving…':'Save contact information'}</button></form><p><Link to="/verify-mobile">Verify your mobile number</Link></p><Link to="/dashboard">Return to dashboard</Link></div></main><Footer/></>;
}
