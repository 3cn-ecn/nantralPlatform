import * as React from 'react';
import {
  IconButton,
  AppBar,
  Typography,
  Box,
  Badge,
  Toolbar,
  Icon,
} from '@mui/material';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import {
  Notifications as NotificationsIcon,
  AccountCircle,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import { createSvgIcon } from '@mui/material/utils';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../theme';
import { SearchBar } from './SearchBar/SearchBar';
import './NavBarTop.scss';
import { ReactComponent as MenuIcon } from '../../assets/scalable/menu.svg';
import { ReactComponent as NotifIcon } from '../../assets/scalable/notification.svg';
import { ReactComponent as PeopleIcon } from '../../assets/scalable/people.svg';
import { ReactComponent as NantralIcon } from '../../assets/logo/scalable/logo.svg';

const HomeIcon = createSvgIcon(
  <path d="M11,17.8h5a.8.8,0,0,0,0-1.6H11a.8.8,0,0,0,0,1.6Z" />,
  'Home'
);

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
    <ThemeProvider theme={theme}>
      <AppBar position="fixed" color="secondary">
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => setMenuOpen(!menuOpen)}
            size="large"
            edge="start"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <SvgIcon component={MenuIcon} inheritViewBox />
          </IconButton>
          <SvgIcon component={NantralIcon} inheritViewBox />
          <Box sx={{ flexGrow: 0.02 }} />
          <Typography variant="h6" component="div" color="TextPrimary">
            Nantral Platform
          </Typography>
          <Box sx={{ flexGrow: 0.9 }} />
          <SearchBar />
          <Box sx={{ flexGrow: 1.0 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={1} color="error">
                <SvgIcon component={NotifIcon} inheritViewBox />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              color="inherit"
            >
              <SvgIcon component={PeopleIcon} inheritViewBox />
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
    </ThemeProvider>
  );
}

export default NavBarTop;
