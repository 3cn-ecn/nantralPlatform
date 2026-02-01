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
      gcTime: 1000 * 60 * 60 * 24 * 7, // time before the garbage collector erases data: 1 week
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
            <RouterProvider router={router(queryClient)} />
          </ToastProvider>
        </AuthProvider>
      </QueryClientProvider>
    </CustomThemeProvider>
  );
}
