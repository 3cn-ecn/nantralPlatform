import { Suspense, useEffect, useState } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';

import {
  Box,
  CircularProgress,
  CssBaseline,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { FlexCol, FlexRow } from '../FlexBox/FlexBox';
import { NavBar } from './NavBar/NavBar';
import { Sidebar } from './Sidebar/Sidebar';

export function PageTemplate() {
  const theme = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const defaultSidebarWidth = 280;

  useEffect(() => {
    setSidebarOpen(isDesktop);
  }, [isDesktop]);

  // NOTES:
  // - <Suspense> is a React component which shows a fallback if something
  //   is loading in its children
  // - <Outlet> is a React-Router component which displays the children pages
  //   defined in the router.tsx

  return (
    <Box
      className={`global-${theme.palette.mode}-theme`}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        overflow: 'hidden',
        backgroundColor: '#f5f5f7',
      }}
    >
      <CssBaseline />
      <ScrollRestoration />
      <NavBar
        open={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isDesktop={isDesktop}
      />
      <Toolbar />
      <Box
        sx={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: sidebarOpen ? `${defaultSidebarWidth}px 1fr` : '0 1fr',
          },
          transition: theme.transitions.create('grid-template-columns', {
            duration: theme.transitions.duration.standard,
            easing: theme.transitions.easing.easeInOut,
          }),
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        <Sidebar open={sidebarOpen} defaultWidth={defaultSidebarWidth} />
        <FlexCol
          component="main"
          sx={{
            minHeight: 0,
            overflowX: 'hidden',
            overflowY: 'auto',
            minWidth: 0,
          }}
        >
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
    </Box>
  );
}
