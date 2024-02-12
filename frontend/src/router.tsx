import { createBrowserRouter } from 'react-router-dom';

import { AuthenticationRedirect } from '#shared/components/AuthenticationRedirect/AuthenticationRedirect';
import { ErrorPageContent } from '#shared/components/ErrorPageContent/ErrorPageContent';
import { useTranslation } from '#shared/i18n/useTranslation';
import { authenticatedRoutes } from '#shared/routes/authenticatedRoutes';
import { publicRoutes } from '#shared/routes/publicRoutes';
import { unauthenticatedRoutes } from '#shared/routes/unauthenticatedRoutes';

export const router = createBrowserRouter([
  {
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: <AuthenticationRedirect authenticated redirectTo="/" />,
        children: [unauthenticatedRoutes],
      },
      {
        element: (
          <AuthenticationRedirect authenticated={false} redirectTo="/login" />
        ),
        children: [authenticatedRoutes],
      },
      publicRoutes,
    ],
  },
]);

export function ErrorBoundary() {
  const { t } = useTranslation();

  return (
    <ErrorPageContent
      retryFn={() => window.location.reload()}
      message={t('error.unexpected')}
      reloadDocument
    />
  );
}
