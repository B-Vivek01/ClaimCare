import { useState } from 'react';
import { Link } from 'react-router-dom';
import { requireBackend } from '../backend/client';
export default function AdminSystemHealth() {
  const [results, setResults] = useState([]);
  const [busy, setBusy] = useState(false);
  const [checkedAt, setCheckedAt] = useState('');
  async function check() {
    if (busy) return;
    setBusy(true);
    try {
      const probes = [['Authentication', () => requireBackend().auth.getUser()], ['Database access', () => requireBackend().from('records').select('id').limit(1)], ['Audit access', () => requireBackend().from('audit_events').select('id').limit(1)]];
      setResults(await Promise.all(probes.map(async ([name, probe]) => {
        const start = performance.now();
        try { const result = await probe(); if (result.error) throw result.error; return { name, status: 'Responded', duration: Math.round(performance.now() - start) }; }
        catch (error) { return { name, status: 'Failed', error: error.message }; }
      })));
      setCheckedAt(new Date().toLocaleString());
    } finally { setBusy(false); }
  }
  return <main className="admin-page"><div className="admin-container"><h1>System checks</h1><Link to="/admin">Administration</Link><p>Run current-session checks. These do not measure uptime, background jobs or storage health.</p><button disabled={busy} onClick={check}>{busy ? 'Checking…' : 'Check now'}</button>{checkedAt && <p role="status">Checked: {checkedAt}</p>}<section className="admin-card">{results.map(result => <p key={result.name}>{result.name}: {result.status}{result.duration != null ? ` (${result.duration} ms)` : ` — ${result.error}`}</p>)}</section><p>Online payments: {import.meta.env.VITE_PAYMENTS_ENABLED === 'true' ? 'Enabled; provider verification required' : 'Setup pending'}. External delivery and uptime monitoring require separate configuration.</p></div></main>;
}
