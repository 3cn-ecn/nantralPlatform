import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '#shared/context/Auth.context';

interface AuthenticationRedirectProps {
  redirectTo: string;
  authenticated: boolean;
}
/**
 * Redirect to a new route depending of the value of `isAuthenticated`
 * @param redirectTo the path to redirect to
 * @param authenticated redirect when `isAuthenticated` equals `authenticated`
 * @returns
 */
export function AuthenticationRedirect({
  redirectTo,
  authenticated,
}: AuthenticationRedirectProps) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  console.log(location.pathname);
  return isAuthenticated !== authenticated ? (
    <Outlet />
  ) : (
    <Navigate to={redirectTo} state={{ from: location }} replace />
  );
}
