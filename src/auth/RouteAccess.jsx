import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { homeForRole, requiredRoles } from './access';
export default function RouteAccess({ children }) {
  const location = useLocation();
  const { user, profile, loading, error } = useAuth();
  const roles = requiredRoles(location.pathname);
  if (!roles) return children;
  if (loading) return <main aria-busy="true" style={{ padding: '4rem', textAlign: 'center' }}>Loading your account…</main>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  if (error) return <main role="alert" style={{ padding: '4rem' }}><h1>Account unavailable</h1><p>{error}</p><button onClick={() => window.location.reload()}>Retry</button><p><Link to="/">Return home</Link></p></main>;
  if (profile?.status === 'Disabled' || profile?.disabled === true) return <main role="alert" style={{ padding: '4rem' }}>Your account has been disabled. Please contact support.</main>;
  if (!['customer', 'operations', 'admin'].includes(profile?.role)) return <main role="alert" style={{ padding: '4rem' }}>Your account role is not configured. Please contact support.</main>;
  if (!roles.includes(profile?.role || 'customer')) return <Navigate to={homeForRole(profile?.role)} replace />;
  return children;
}
