import { useCallback, useEffect, useRef, useState } from 'react';
import { requireBackend } from '../backend/client';
import { useAuth } from '../auth/AuthContext';
import { changesBetween } from './records';
function report(detail) { window.dispatchEvent(new CustomEvent('claimcare:data', { detail })); }
export function useRecords(name, ownOnly = false) {
  const { user, profile } = useAuth();
  const uid = user?.uid;
  const role = profile?.role;
  const [records, render] = useState([]);
  const [loading, setLoading] = useState(true);
  const current = useRef([]);
  const ready = useRef(false);
  const queue = useRef(Promise.resolve());
  const epoch = useRef(0);
  const refresh = useRef(async () => {});
  useEffect(() => {
    const generation = ++epoch.current;
    ready.current = false;
    current.current = [];
    render([]);
    setLoading(true);
    if (!uid || !role) { setLoading(false); return; }
    const backend = requireBackend();
    let active = true;
    const load = async () => {
      try {
        let selection = backend.from('records').select('data,revision,owner_id').eq('collection', name);
        if (ownOnly) selection = selection.eq('owner_id',uid);
        const { data, error } = await selection.order('updated_at', { ascending: false });
        if (error) throw error;
        if (!active || epoch.current !== generation) return;
        current.current = data.map(row => ({ ...row.data, ownerId: row.owner_id, revision: row.revision }));
        render(current.current); ready.current = true;
      } catch (error) { if (active) { ready.current = false; report({ error: `Cannot load ${name}: ${error.message}` }); } }
      finally { if (active) setLoading(false); }
    };
    refresh.current = load;
    load();
    // Polling also works when Realtime is not enabled in a newly created project.
    const poll = setInterval(() => { queue.current.then(load); }, 15000);
    const channel = backend.channel(`records:${name}:${crypto.randomUUID()}`).on('postgres_changes', { event: '*', schema: 'public', table: 'records', filter: `collection=eq.${name}` }, () => { queue.current.then(load); }).subscribe();
    return () => { active = false; clearInterval(poll); backend.removeChannel(channel); };
  }, [name, uid, role, ownOnly]);
  const setRecords = useCallback(update => {
    if (!uid || !ready.current) { report({ error: 'Data is not ready. Wait for it to load before saving.' }); return Promise.resolve(false); }
    const generation = epoch.current;
    report({ pending: 1 });
    const save = queue.current.then(async () => {
      if (epoch.current !== generation) return false;
      try {
        const previous = current.current;
        const proposed = typeof update === 'function' ? update(previous) : update;
        const next = proposed.map(item => ({ ...item, ownerId: item.ownerId || uid }));
        const changes = changesBetween(previous, next);
        const mutations = [...changes.writes.map(item => ({ action: 'write', id: String(item.id), owner_id: item.ownerId, expected_revision: previous.find(row => row.id === item.id)?.revision || 0, data: item })), ...changes.deletes.map(item => ({ action: 'delete', id: String(item.id), expected_revision: item.revision }))];
        if (!mutations.length) return true;
        const { error } = await requireBackend().rpc('mutate_records', { module_name: name, mutations });
        if (error) throw error;
        await refresh.current();
        return true;
      } catch (error) { report({ error: `Save failed: ${error.message || 'Please retry.'}` }); await refresh.current(); return false; }
    }).finally(() => report({ pending: -1 }));
    queue.current = save;
    return save;
  }, [name, uid]);
  return [records, setRecords, Boolean(user) && loading];
}

