import { Navigate, Outlet, Route, useLocation } from 'react-router-dom';

import { useAuth } from '#shared/context/Auth.context';

const RequiresAuth = () => {
  // const { auth } = useAuth();
  const location = useLocation();

  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div></div>;
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export function PrivateRoute({ children, ...rest }: { children }) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <Route {...rest}>{children}</Route>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default RequiresAuth;
