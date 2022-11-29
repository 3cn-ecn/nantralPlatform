import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Home from './pages/Home/Home';
import Test1 from './pages/Test1/Test1';
import NavBarTop from './components/NavBarTop/NavBarTop';
import NavBarSide from './components/NavBarSide/NavBarSide';
import NotFound from './pages/NotFound/NotFound';
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
  const drawerWidth = 240; // the width of the lateral navbar
  const theme = useTheme(); // use properties from the MUI theme

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <NavBarTop menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
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
          <Route path="/test1" element={<Test1 />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
