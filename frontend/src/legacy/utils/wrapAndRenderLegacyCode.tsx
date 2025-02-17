/**
 * This is a copy from index.tsx and app.tsx.
 * This file should be deleted when all legacy code will be merged into the
 * new code and removed.
 */
import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Link, NavLink } from 'react-router-dom';

import { ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';

import { AuthProvider } from '#shared/context/Auth.context';
import { CustomThemeProvider } from '#shared/context/CustomTheme.context';
import { ToastProvider } from '#shared/context/Toast.context';

import '../../index.scss';
import '../../shared/i18n/config';
import getTheme from '../../theme';
import './styles.scss';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.paramsSerializer = { indexes: null };

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

export const wrapAndRenderLegacyCode = (
  element: ReactNode,
  elementId: string,
): void => {
  const rootElement = document.getElementById(elementId);
  if (rootElement === null) return;
  const root = ReactDOM.createRoot(rootElement);

  // legacy pages only support light theme and french language
  const theme = getTheme('light', 'fr-FR');
  // always reload document because we're outside of React Router
  Link.defaultProps = {
    ...Link.defaultProps,
    reloadDocument: true,
  };
  NavLink.defaultProps = {
    ...NavLink.defaultProps,
    reloadDocument: true,
  };

  // fill in the React root with our wrapped element
  root.render(
    <React.StrictMode>
      <CustomThemeProvider>
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <ToastProvider>
                <BrowserRouter>
                  <div className="react-legacy-container">{element}</div>
                </BrowserRouter>
              </ToastProvider>
            </AuthProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </CustomThemeProvider>
    </React.StrictMode>,
  );
};
