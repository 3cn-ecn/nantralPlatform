import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';

import { AuthProvider } from '#shared/context/Auth.context';
import { CustomThemeProvider } from '#shared/context/CustomTheme.context';
import { ToastProvider } from '#shared/context/Toast.context';

import '../index.scss';
import '../shared/i18n/config';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.paramsSerializer = { indexes: null };

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

export const wrapAndRenderTemplates = (
  element: ReactNode,
  elementId: string,
): void => {
  const rootElement = document.getElementById(elementId);
  if (rootElement === null) return;
  const root = ReactDOM.createRoot(rootElement);

  // fill in the React root with our wrapped element
  root.render(
    <React.StrictMode>
      <CustomThemeProvider>
        <CustomThemeProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <ToastProvider>
                <BrowserRouter>{element}</BrowserRouter>
              </ToastProvider>
            </AuthProvider>
          </QueryClientProvider>
        </CustomThemeProvider>
      </CustomThemeProvider>
    </React.StrictMode>,
  );
};
