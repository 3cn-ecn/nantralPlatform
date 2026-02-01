import React from 'react';
import {
  createMemoryRouter,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import axios from 'axios';

import { CustomThemeProvider } from '#shared/context/CustomTheme.context';
import { ToastProvider } from '#shared/context/Toast.context';

import '../i18n/config';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.paramsSerializer = { indexes: null };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
  },
});

/**
 * Customise the `render` function from '@testing-library/react' but with some
 * default providers so that elements can be rendered correctly:
 * -> language: 'en' by default
 * -> theme: 'light' by default
 *
 * @param element - the element to render
 * @returns
 */
export function renderWithProviders(
  element: React.ReactElement,
  otherRoutes: RouteObject[] = [],
  path = '/',
) {
  const router = createMemoryRouter([{ path, element }, ...otherRoutes], {
    initialEntries: [path],
  });

  return render(
    <CustomThemeProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </QueryClientProvider>
    </CustomThemeProvider>,
  );
}
