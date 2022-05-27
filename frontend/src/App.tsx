import React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { styled } from "@mui/material/styles";
import Sidebar from "./components/navbar/sidebar";
import {Route,Routes} from 'react-router-dom';
import Test1 from "./components/navbar/test1";
import Test2 from "./components/navbar/test2";
import Upbar from "./components/navbar/upBar"
import NotFound from "./components/notFound";

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
          <Route path="/" element = {<h1>Bonjour, page d'accueil</h1>}/>
          <Route path = '/test1' element = {<Test1/>}/>
          <Route path = '/test2' element = {<Test2/>}/>
          <Route path = '*' element = {<NotFound/>}/>
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
