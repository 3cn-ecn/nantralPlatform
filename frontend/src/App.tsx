import { RouterProvider } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from '#shared/context/Auth.context';
import { CustomThemeProvider } from '#shared/context/CustomTheme.context';
import { ToastProvider } from '#shared/context/Toast.context';

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
  return (
    <CustomThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </AuthProvider>
      </QueryClientProvider>
    </CustomThemeProvider>
  );
}
