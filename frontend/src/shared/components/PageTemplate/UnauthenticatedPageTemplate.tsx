import { Suspense } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';

import { Box, CircularProgress, CssBaseline, Stack } from '@mui/material';

import './UnauthenticatedPage.scss';

export function UnauthenticatedPageTemplate() {
  // NOTES:
  // - <Suspense> is a React component which shows a fallback if something
  //   is loading in its children
  // - <Outlet> is a React-Router component which displays the children pages
  //   defined in the router.tsx

  return (
    <Box sx={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
      <Box className={'content'} style={{ position: 'fixed' }}>
        <Box className="blur"></Box>
      </Box>
      <CssBaseline />
      <ScrollRestoration />
      <Suspense
        fallback={
          <Stack direction="row" sx={{ justifyContent: 'center', mt: 8 }}>
            <CircularProgress />
          </Stack>
        }
      >
        <Outlet />
      </Suspense>
    </Box>
  );
}
