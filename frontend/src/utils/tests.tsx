import React from 'react';

import { ThemeProvider } from '@mui/material/styles';
import { render } from '@testing-library/react';

import getTheme from '../theme';
import '../translations/config';

/**
 * Customise the `render` function from '@testing-library/react' but with some
 * default providers so that elements can be rendered correctly:
 * -> language: 'en' by default
 * -> theme: 'light' by default
 *
 * @param element - the element to render
 * @returns
 */
export function wrapAndRender(element: React.ReactElement) {
  return render(
    <ThemeProvider theme={getTheme('light')}>{element}</ThemeProvider>
  );
}
