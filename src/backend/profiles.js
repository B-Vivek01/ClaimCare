import { requireBackend } from './client';
export const db = {};
export function doc(_db, collection, id) {
  if (collection !== 'customers') throw new Error('Unsupported profile collection.');
  return { id };
}
function snapshot(record) { return { exists: () => Boolean(record), data: () => record?.data }; }
export async function getDoc(reference) {
  const { data, error } = await requireBackend().from('profiles').select('data').eq('id', reference.id).maybeSingle();
  if (error) throw error;
  return snapshot(data);
}
export async function updateDoc(reference, changes) {
  const { error } = await requireBackend().rpc('update_profile', { target_id: reference.id, changes });
  if (error) throw error;
  window.dispatchEvent(new CustomEvent('claimcare:profile'));
}
export function onSnapshot(reference, callback, onError) {
  let active = true;
  let channel;
  async function load() { try { const value = await getDoc(reference); if (active) callback(value); } catch (error) { if (active) onError?.(error); } }
  load();
  window.addEventListener('claimcare:profile', load);
  const timer = setInterval(load,30000);
  try { channel = requireBackend().channel(`profile:${reference.id}:${crypto.randomUUID()}`).on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${reference.id}` }, load).subscribe(); }
  catch (error) { onError?.(error); }
  return () => { active = false; clearInterval(timer); window.removeEventListener('claimcare:profile',load); if (channel) requireBackend().removeChannel(channel); };
}
