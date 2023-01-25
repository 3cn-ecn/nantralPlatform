import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import Home from './pages/Home/Home';
import Test1 from './pages/Test1/Test1';
import NavBarTop from './components/NavBarTop/NavBarTop';
import NavBarSide from './components/NavBarSide/NavBarSide';
import NotFound from './pages/NotFound/NotFound';
import Event from './pages/Event/Event';
import Academics from './pages/Academics/Academics';
import Admin from './pages/Admin/Admin';
import BDX from './pages/BDX/BDX';
import Club from './pages/Club/Club';
import Family from './pages/Family/Family';
import Map from './pages/Map/Map';
import Sign from './pages/Sign/Sign';
import Student from './pages/Student/Student';
import LegalNotice from './pages/LegalNotice/Legal';
import theme from './theme';
import darktheme from './darktheme';
import './App.scss';

/**
 * Main component of the application. It is composed of:
 * - the top navbar
 * - the lateral navbar
 * - the route component (where we decide which component to show according to the path in the url)
 * @returns The App Component
 */
function App() {
  const [menuOpen, setMenuOpen] = React.useState(true);
  const [themeApp, setThemeApp] = React.useState(true);
  const drawerWidth = 240; // the width of the lateral navbar
  const count = 0;
  return (
    <ThemeProvider theme={themeApp ? theme : darktheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <NavBarTop
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          themeApp={themeApp}
          setThemeApp={setThemeApp}
        />
        <NavBarSide menuOpen={menuOpen} drawerWidth={drawerWidth} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            padding: theme.spacing(3),
            paddingTop: 0,
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: `-${drawerWidth}px`,
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
            <Route path="/club" element={<Club />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/event" element={<Event />} />
            <Route path="/academics" element={<Academics />} />
            <Route path="/administration" element={<Admin />} />
            <Route path="/liste" element={<BDX />} />
            <Route path="/parrainage" element={<Family />} />
            <Route path="/colocs" element={<Map />} />
            <Route path="/student" element={<Student />} />
            <Route path="/legal-notice" element={<LegalNotice />} />
            <Route path="/tools/signature" element={<Sign />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
