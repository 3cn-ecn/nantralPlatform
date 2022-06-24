import * as React from 'react';
import {
  IconButton,
  AppBar,
  Typography,
  Box,
  Badge,
  Toolbar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import { SearchBar } from './searchBar/searchBar';
import './topBar.scss';

/**
 * The top bar for navigation
 *
 * @param props Properties
 * @param props.handleDrawerOpen Toggle the sidebar menu
 * @returns The component
 */
function TopBar(props: {
  handleDrawerOpen: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const { handleDrawerOpen } = props;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={handleDrawerOpen}
            size="large"
            edge="start"
            aria-label="menu"
            sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div">
            Nantral Platform
          </Typography>
          <Box sx={{ flexGrow: 0.8 }} />
          <SearchBar />
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit">
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              color="inherit">
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-haspopup="true"
              color="inherit">
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default TopBar;
