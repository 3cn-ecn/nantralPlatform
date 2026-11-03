import {
  createBrowserRouter,
  isRouteErrorResponse,
  useRouteError,
} from 'react-router-dom';

import { QueryClient, useQueryErrorResetBoundary } from '@tanstack/react-query';

import { AuthenticationRedirect } from '#shared/components/AuthenticationRedirect/AuthenticationRedirect';
import { ErrorPageContent } from '#shared/components/ErrorPageContent/ErrorPageContent';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiError } from '#shared/infra/errors';
import { authenticatedRoutes } from '#shared/routes/authenticatedRoutes';
import { publicRoutes } from '#shared/routes/publicRoutes';
import { unauthenticatedRoutes } from '#shared/routes/unauthenticatedRoutes';

export const router = (queryClient: QueryClient) =>
  createBrowserRouter([
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
          children: [authenticatedRoutes(queryClient)],
        },
        publicRoutes(queryClient),
      ],
    },
  ]);

export function ErrorBoundary() {
  const { t } = useTranslation();
  const error = useRouteError();
  const { reset } = useQueryErrorResetBoundary();

  if (isRouteErrorResponse(error)) {
    return (
      <ErrorPageContent
        retryFn={() => window.location.reload()}
        message={t('error.routerResponse', error)}
        reloadDocument
      />
    );
  }

  const runtimeError = error as Error | ApiError;

  return (
    <ErrorPageContent
      status={'status' in runtimeError ? runtimeError.status : undefined}
      retryFn={() => {
        reset();
        window.location.reload();
      }}
      message={runtimeError.message || t('error.unexpected')}
      reloadDocument
    />
  );
}
