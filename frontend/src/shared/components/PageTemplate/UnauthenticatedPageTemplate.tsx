import { Suspense } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';

import { Box, CircularProgress, CssBaseline } from '@mui/material';

import { FlexRow } from '../FlexBox/FlexBox';
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
          <FlexRow justifyContent="center" mt={8}>
            <CircularProgress />
          </FlexRow>
        }
      >
        <Outlet />
      </Suspense>
    </Box>
  );
}
