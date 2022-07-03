import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Home from './apps/home/home';
import Test1 from './apps/test1/test1';
import Test2 from './apps/test2/test2';
import TopBar from './components/navbar/topBar';
import NotFound from './components/notFound';
import './App.scss';

function App() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <TopBar />
      {/* <Sidebar handleDrawerClose={handleDrawerToggle} open={open} /> */}
      <Box component="main" className="main-content">
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
