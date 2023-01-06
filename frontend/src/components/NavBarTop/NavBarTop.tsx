import * as React from 'react';
import {
  IconButton,
  AppBar,
  Typography,
  Box,
  Badge,
  Toolbar,
  SvgIcon,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import { SearchBar } from './SearchBar/SearchBar';
import './NavBarTop.scss';

/**
 * The top bar for navigation
 *
 * @param props Component Properties
 * @param {boolean} props.menuOpen - A boolean to indicate if the lateral menu
 * is open or not.
 * @params props.setMenuOpen - A function to change the state of the menu.
 * @returns The top bar component
 */
function NavBarTop(props: {
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { menuOpen, setMenuOpen } = props;
  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          color="inherit"
          onClick={() => setMenuOpen(!menuOpen)}
          size="large"
          edge="start"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <SvgIcon {...props}>
            <path d="./assets/scalable/menu.svg" />
          </SvgIcon>
        </IconButton>
        <Typography variant="h6" component="div">
          Nantral Platform
        </Typography>
        <Box sx={{ flexGrow: 0.4 }} />
        <SearchBar />
        <Box sx={{ flexGrow: 0.4 }} />
        <Badge badgeContent={10} color="error">
          <Typography variant="h6" component="div">
            Random Texte
          </Typography>
        </Badge>
        <Box sx={{ flexGrow: 0.4 }} />
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <IconButton
            size="large"
            aria-label="show 17 new notifications"
            color="inherit"
          >
            <Badge badgeContent={1} color="error">
              <AccountCircle />
            </Badge>
          </IconButton>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </Box>
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            aria-label="show more"
            aria-haspopup="true"
            color="inherit"
          >
            <MoreIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBarTop;
