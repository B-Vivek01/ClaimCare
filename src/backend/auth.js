import { requireBackend, supabase } from './client';
let currentUser = null;
let recoveryUid = null;
// Capture recovery events before lazy pages or React effects subscribe.
supabase?.auth.onAuthStateChange((event, session) => {
  if (event === 'PASSWORD_RECOVERY') recoveryUid = session?.user?.id || null;
  else if (event === 'SIGNED_OUT' || event === 'SIGNED_IN') recoveryUid = null;
});
function userView(user) {
  if (!user) return null;
  return { ...user, uid: user.id, displayName: user.user_metadata?.name || '', emailVerified: Boolean(user.email_confirmed_at), phoneNumber: user.phone_confirmed_at ? user.phone : null,
    getIdToken: async () => (await requireBackend().auth.getSession()).data.session?.access_token };
}
export const auth = { get currentUser() { return currentUser; }, get recovering() { return Boolean(recoveryUid && recoveryUid===currentUser?.uid); } };
export function onAuthStateChanged(_auth, callback, onError) {
  let active = true;
  if (!supabase) { queueMicrotask(() => active && callback(null)); return () => { active = false; }; }
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    currentUser = userView(session?.user);
    const nextUser = currentUser;
    setTimeout(() => { if (active) Promise.resolve(callback(nextUser)).catch(error => onError?.(error)); }, 0);
  });
  return () => { active = false; data.subscription.unsubscribe(); };
}
export async function signInWithEmailAndPassword(_auth, email, password) {
  const { data, error } = await requireBackend().auth.signInWithPassword({ email, password });
  if (error) throw error;
  currentUser = userView(data.user);
  return { user: currentUser };
}
export async function signOut() {
  const { error } = await requireBackend().auth.signOut();
  if (error) throw error;
  currentUser = null;
}
export const EmailAuthProvider = { credential: (email, password) => ({ email, password }) };
export async function reauthenticateWithCredential(_user, credentials) {
  const { error } = await requireBackend().auth.signInWithPassword(credentials);
  if (error) throw error;
}
export async function updatePassword(_user, password) {
  const { error } = await requireBackend().auth.updateUser({ password });
  if (error) throw error;
}
