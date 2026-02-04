import { Suspense } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';

import {
  Box,
  CircularProgress,
  CssBaseline,
  Toolbar,
  useTheme,
} from '@mui/material';

import { FlexCol, FlexRow } from '../FlexBox/FlexBox';
import { NavBar } from './NavBar/NavBar';

export function PageTemplate() {
  const theme = useTheme();

  // NOTES:
  // - <Suspense> is a React component which shows a fallback if something
  //   is loading in its children
  // - <Outlet> is a React-Router component which displays the children pages
  //   defined in the router.tsx

  return (
    <Box
      className={`global-${theme.palette.mode}-theme`}
      sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      <CssBaseline />
      <ScrollRestoration />
      <NavBar />
      <FlexCol
        component="main"
        sx={{
          flexGrow: 1, // prend tout l’espace restant
          display: 'flex',
          flexDirection: 'column',
        }}
      >
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
      </FlexCol>
    </Box>
  );
}
