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
 * Redirect to a new route depending on the value of `isAuthenticated`
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
  const [params] = useSearchParams();

  if (isAuthenticated === authenticated) {
    const nextUrl = params.get('next');
    if (nextUrl) {
      // first try normal redirect if the redirect was triggered by django (next utl param)
      window.location.href = nextUrl;
    } else {
      // if it is not the case, use React Router redirect.
      return (
        <Navigate
          to={location.state?.from || redirectTo}
          state={{ from: location }}
          replace
        />
      );
    }
  }
  // Show the page if no redirect is to be done
  return <Outlet />;
}
