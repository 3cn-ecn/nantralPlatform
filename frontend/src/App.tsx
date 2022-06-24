import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';
import Home from './apps/home/home';
import Test1 from './apps/test1/test1';
import Test2 from './apps/test2/test2';
import Sidebar from './components/navbar/sideBar/sidebar';
import TopBar from './components/navbar/topBar';
import NotFound from './components/notFound';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

function App() {
  const [open, setOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <TopBar handleDrawerOpen={handleDrawerToggle} />
      {/* <Sidebar handleDrawerClose={handleDrawerToggle} open={open} /> */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test1" element={<Test1 />} />
          <Route path="/test2" element={<Test2 />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
