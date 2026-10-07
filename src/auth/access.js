const publicPaths = new Set(['/', '/about', '/services', '/pricing', '/faq', '/contact', '/register', '/login', '/privacy', '/terms', '/forgot-password', '/reset-password', '/confirm-email']);
export function requiredRoles(pathname) {
  if (pathname === '/reports/customer') return ['customer', 'operations', 'admin'];
  if (publicPaths.has(pathname)) return null;
  if (/^\/admin(?:\/|$)/.test(pathname)) return ['admin'];
  if (/^\/(ops|workflow|reports)(?:\/|$)/.test(pathname)) return ['operations', 'admin'];
  if (/^\/communication\/(templates|broadcasts|reports|settings)(?:\/|$)/.test(pathname)) return ['operations', 'admin'];
  if (/^\/knowledge\/(publishing|versioning|categories|tags)(?:\/|$)/.test(pathname)) return ['operations', 'admin'];
  return ['customer', 'operations', 'admin'];
}
export function homeForRole(role) {
  return role === 'admin' ? '/admin' : role === 'operations' ? '/ops' : '/dashboard';
}
