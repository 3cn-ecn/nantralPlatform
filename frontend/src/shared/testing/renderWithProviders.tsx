import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';

import { render } from '@testing-library/react';

import { CustomThemeProvider } from '#shared/context/CustomTheme.context';
import { ToastProvider } from '#shared/context/Toast.context';

import '../i18n/config';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
      suspense: true,
      useErrorBoundary(_, query) {
        return query.state.data === undefined;
      },
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
export function renderWithProviders(element: React.ReactElement, route = '/') {
  const router = createMemoryRouter(
    [
      {
        path: route,
        element: element,
      },
    ],
    { initialEntries: [route] }
  );

  return render(
    <CustomThemeProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </QueryClientProvider>
    </CustomThemeProvider>
  );
}