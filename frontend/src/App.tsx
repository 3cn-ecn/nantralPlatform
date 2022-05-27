import React from "react";
import {Route,Routes} from 'react-router-dom';
import Home from "./apps/home/home";
import Test1 from "./apps/test1/test1";
import Test2 from "./apps/test2/test2";
import Sidebar from "./components/navbar/sidebar";
import Upbar from "./components/navbar/upBar"
import NotFound from "./components/notFound";
import { Box, CssBaseline } from "@mui/material";
import { styled } from "@mui/material/styles";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
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
      <Upbar handleDrawerOpen = {handleDrawerToggle} open = {open}/>
      <Sidebar handleDrawerClose = {handleDrawerToggle} open = {open}/>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Routes>
          <Route path="/" element = {<Home/>}/>
          <Route path = '/test1' element = {<Test1/>}/>
          <Route path = '/test2' element = {<Test2/>}/>
          <Route path = '*' element = {<NotFound/>}/>
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
