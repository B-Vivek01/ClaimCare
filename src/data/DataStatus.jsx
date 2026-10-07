import { useEffect, useRef, useState } from 'react';
export default function DataStatus() {
  const [pending, setPending] = useState(0);
  const [error, setError] = useState('');
  const pendingCount=useRef(0);
  useEffect(() => {
    const receive = ({ detail }) => {
      if (detail.error) setError(detail.error);
      if (detail.pending) {pendingCount.current=Math.max(0,pendingCount.current+detail.pending);setPending(pendingCount.current);}
    };
    const beforeUnload = event => { if (pendingCount.current) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('claimcare:data', receive);
    window.addEventListener('beforeunload', beforeUnload);
    return () => { window.removeEventListener('claimcare:data', receive); window.removeEventListener('beforeunload', beforeUnload); };
  }, []);
  if (!pending && !error) return null;
  return <aside role={error ? 'alert' : 'status'} style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 10000, background: error ? '#fff1f2' : '#eff6ff', color: '#172554', padding: 16, border: '1px solid #94a3b8', borderRadius: 8, maxWidth: 420 }}>{error || 'Saving changes…'}{error && <div><button onClick={() => window.location.reload()}>Reload data</button><button onClick={() => setError('')}>Dismiss</button></div>}</aside>;
}
