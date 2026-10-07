import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from '../backend/auth';
import { doc, onSnapshot } from '../backend/profiles';
import { auth, db } from '../backend/session';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [session, setSession] = useState({ user: null, profile: null, loading: true, error: '', recovering: false });
  useEffect(() => {
    let stopProfile = () => {};
    let currentUid = null;
    const stopAuth = onAuthStateChanged(auth, (user) => {
      if (user && user.uid === currentUid) { setSession(previous => ({ ...previous, user, recovering:auth.recovering })); return; }
      currentUid = user?.uid || null;
      stopProfile();
      setSession({ user, profile: null, loading: Boolean(user), error: '', recovering:auth.recovering });
      if (!user) {
        for (const key of ['claimcare_current_user', 'claimcare_user_name', 'claimcare_user_uid']) localStorage.removeItem(key);
        return;
      }
      stopProfile = onSnapshot(doc(db, 'customers', user.uid), (snapshot) => {
        setSession(previous => ({ ...previous, user: previous.user || user, profile: snapshot.exists() ? snapshot.data() : null, loading: false,
          error: snapshot.exists() ? '' : 'Your account profile is missing. Please contact support.' }));
      }, () => setSession({ user, profile: null, loading: false, error: 'Unable to load your account. Check your connection and try again.' }));
    }, () => setSession({ user: null, profile: null, loading: false, error: 'Unable to check your session. Please reload.' }));
    return () => { stopAuth(); stopProfile(); };
  }, []);
  return <AuthContext.Provider value={session}>{children}</AuthContext.Provider>;
}
export function useAuth() { return useContext(AuthContext); }
