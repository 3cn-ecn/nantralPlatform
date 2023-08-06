import { ErrorBoundary } from 'react-error-boundary';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RouterProvider } from 'react-router-dom';

import { ErrorPageContent } from '#shared/components/ErrorPageContent/ErrorPageContent';
import { CustomThemeProvider } from '#shared/context/CustomTheme.context';
import { ToastProvider } from '#shared/context/Toast.context';
import { useTranslation } from '#shared/i18n/useTranslation';

import { router } from './router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // time before refetching the server: 1min
      cacheTime: 1000 * 60 * 60 * 24 * 7, // time before erasing the cached data: 1 week
      retry: 1,
      retryDelay: 1000,
    },
  },
});

export function App() {
  const { t } = useTranslation();

  return (
    <CustomThemeProvider>
      <ErrorBoundary
        fallback={
          <ErrorPageContent
            retryFn={() => window.location.reload()}
            message={t('error.unexpected')}
            reloadDocument
          />
        }
      >
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </CustomThemeProvider>
  );
}
