import {
  Navigate,
  Outlet,
  useLocation,
  useSearchParams,
} from 'react-router-dom';

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
  const [searchParams] = useSearchParams();
  const next = searchParams.get('next');

  if (isAuthenticated !== authenticated) {
    return <Outlet />;
  } else {
    if (next) {
      // if the backend requested an authentification, redirect to the page on the backend
      window.location.href = next;
    } else {
      return (
        <Navigate
          to={location.state?.from || redirectTo}
          state={{ from: location }}
          replace
        />
      );
    }
  }
}
