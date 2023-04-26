import React, { useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Route, Routes } from 'react-router-dom';

import { Box, CssBaseline, PaletteMode, Toolbar } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import NavBarSide from '#components/NavBarSide/NavBarSide';
import NavBarTop from '#components/NavBarTop/NavBarTop';
import Event from '#pages/Event/Event.page';
import EventDetails from '#pages/Event/EventDetails/EventDetails.page';
import Group from '#pages/Group/Group.page';
import Home from '#pages/Home/Home.page';
import LegalNotice from '#pages/LegalNotice/Legal.page';
import NotFound from '#pages/NotFound/NotFound.page';
import Profile from '#pages/Profile/Profile.page';
import Student from '#pages/Student/Student.page';

import getTheme from './theme';

const queryClient = new QueryClient();

const getPreferredMode = (): PaletteMode | 'auto' => {
  const cachedMode = localStorage.getItem('theme-mode');
  switch (cachedMode) {
    case 'dark':
      return 'dark';
    case 'light':
      return 'light';
    default:
      return 'auto';
  }
};

/**
 * Main component of the application. It is composed of:
 * - the top navbar
 * - the lateral navbar
 * - the route component (where we decide which component to show according to the path in the url)
 * @returns The App Component
 */
function App() {
  const [preferredMode, setPreferredMode] = useState<PaletteMode | 'auto'>(
    getPreferredMode()
  );
  const systemInDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(() => {
    const systemMode = systemInDarkMode ? 'dark' : 'light';
    return getTheme(preferredMode === 'auto' ? systemMode : preferredMode);
  }, [preferredMode, systemInDarkMode]);

  const [menuOpen, setMenuOpen] = useState(false);
  const drawerWidth = 240; // the width of the lateral navbar
  const sideBarVariant =
    window.innerWidth < 2 * drawerWidth ? 'temporary' : 'persistent';

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <NavBarTop
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            colorMode={preferredMode}
            setColorMode={setPreferredMode}
          />
          <NavBarSide
            menuOpen={menuOpen}
            drawerWidth={drawerWidth}
            variant={sideBarVariant}
            onClose={() => setMenuOpen(false)}
          />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              width: '100%',
              padding: 0,
              paddingTop: 0,
              transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              marginLeft:
                sideBarVariant === 'persistent' ? `-${drawerWidth}px` : 0,
              ...(menuOpen && {
                transition: theme.transitions.create('margin', {
                  easing: theme.transitions.easing.easeOut,
                  duration: theme.transitions.duration.enteringScreen,
                }),
                marginLeft: 0,
              }),
            }}
          >
            <Toolbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/group" element={<Group />} />
              <Route path="/event" element={<Event />} />
              <Route path="/event/:id" element={<EventDetails />} />
              <Route path="/student" element={<Student />} />
              <Route path="/legal-notice" element={<LegalNotice />} />
              <Route path="/student/:studentId" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
              {/* <Route path="/group/:groupTypeSlug" element={<GroupList />} /> */}
            </Routes>
          </Box>
        </Box>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
