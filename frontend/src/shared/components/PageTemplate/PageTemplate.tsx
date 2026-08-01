import { Suspense, useEffect, useState } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';

import { CircularProgress } from '@mui/material';

import { FlexCol, FlexRow } from '../FlexBox/FlexBox';
import { NavBar } from './NavBar/NavBar';
import { Sidebar } from './Sidebar/Sidebar';

const desktopBreakpointQuery = '(min-width: 1024px)';

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') {
      return true;
    }

    return window.matchMedia(desktopBreakpointQuery).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(desktopBreakpointQuery);
    const handleChange = () => setIsDesktop(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isDesktop;
}

export function PageTemplate() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isDesktop = useIsDesktop();
  const defaultSidebarWidth = 280;
  let gridTemplateColumns = '1fr';

  if (isDesktop) {
    gridTemplateColumns = sidebarOpen
      ? `${defaultSidebarWidth}px 1fr`
      : '0 1fr';
  }

  useEffect(() => {
    setSidebarOpen(isDesktop);
  }, [isDesktop]);

  // NOTES:
  // - <Suspense> is a React component which shows a fallback if something
  //   is loading in its children
  // - <Outlet> is a React-Router component which displays the children pages
  //   defined in the router.tsx

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#f5f5f7]">
      <ScrollRestoration />
      <NavBar
        open={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isDesktop={isDesktop}
      />
      <div className="h-14 md:h-16" />
      <div
        className="relative grid flex-1 overflow-hidden transition-[grid-template-columns] duration-300 ease-in-out"
        style={{ gridTemplateColumns }}
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
      </div>
    </div>
  );
}
