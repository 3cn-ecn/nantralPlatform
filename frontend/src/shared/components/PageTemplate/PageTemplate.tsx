import { Suspense, useState } from 'react';
import { Outlet } from 'react-router-dom';

import {
  Box,
  CircularProgress,
  CssBaseline,
  Toolbar,
  useTheme,
} from '@mui/material';

import { FlexRow } from '../FlexBox/FlexBox';
import { ScrollToTop } from '../ScrollToTop/ScrollToTop';
import NavBarSide from './components/NavBarSide/NavBarSide';
import NavBarTop from './components/NavBarTop/NavBarTop';

export function PageTemplate() {
  const theme = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerWidth = 240; // the width of the lateral navbar
  const sideBarVariant =
    window.innerWidth < 2 * drawerWidth ? 'temporary' : 'persistent';

  return (
    <Box
      sx={{ display: 'flex' }}
      className={`global-${theme.palette.mode}-theme`}
    >
      <CssBaseline />
      <NavBarTop menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
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
          marginLeft: sideBarVariant === 'persistent' ? `-${drawerWidth}px` : 0,
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
        <ScrollToTop />
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
