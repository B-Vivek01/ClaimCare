import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useClaims } from '../claim/ClaimContext';

export default function CustomerReport() {
  const { user } = useAuth();
  const { claims } = useClaims();
  const ownClaims = claims.filter(claim => claim.ownerId === user?.uid);
  function download() {
    const rows = ownClaims.map(({ claimNumber, policyNumber, status, category, createdAt }) => ({ claimNumber, policyNumber, status, category, createdAt }));
    const url = URL.createObjectURL(new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'my-claim-report.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <main className="reporting-page"><div className="reporting-container">
    <h1>My claim report</h1><Link to="/dashboard">Dashboard</Link>
    <p>{ownClaims.length} claim record(s) in your account.</p>
    <button onClick={download} disabled={!ownClaims.length}>Download my report</button>
    <section className="reporting-card">{ownClaims.length ? ownClaims.map(claim => <p key={claim.id}>
      <Link to={`/claims/${claim.id}`}>{claim.claimNumber}</Link> — {claim.status} — {claim.policyNumber}
    </p>) : <p>No claims yet.</p>}</section>
  </div></main>;
}
