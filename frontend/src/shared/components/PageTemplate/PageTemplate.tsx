import { Suspense } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';

import {
  Box,
  CircularProgress,
  CssBaseline,
  Toolbar,
  useTheme,
} from '@mui/material';

import { FlexRow } from '../FlexBox/FlexBox';
import { NavBarTop } from './components/NavBarTop/NavBarTop';

export function PageTemplate() {
  const theme = useTheme();

  // NOTES:
  // - <Suspense> is a React component which shows a fallback if something
  //   is loading in its children
  // - <Outlet> is a React-Router component which displays the children pages
  //   defined in the router.tsx

  return (
    <Box className={`global-${theme.palette.mode}-theme`}>
      <CssBaseline />
      <ScrollRestoration />
      <NavBarTop />
      <Box component="main">
        <Toolbar />
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
    </Box>
  );
}
