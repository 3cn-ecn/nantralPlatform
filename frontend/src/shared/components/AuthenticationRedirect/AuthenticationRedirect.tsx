import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { update } from 'lodash-es';

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

  // redirect to update-username field to make the user change their username
  return isAuthenticated !== authenticated ? (
    <Outlet />
  ) : (
    <Navigate
      to={location.state?.from || redirectTo}
      state={{
        from: authenticated
          ? '/update-username/?from=' + location.pathname
          : location,
      }}
      replace
    />
  );
}
