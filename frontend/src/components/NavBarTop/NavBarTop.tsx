import * as React from 'react';
import i18next from 'i18next';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { Link } from "react-router-dom";

import Legal from 'pages/LegalNotice/Legal';
import {
  IconButton,
  AppBar,
  Typography,
  Box,
  Badge,
  Toolbar,
  Menu,
  MenuItem,
  ListItem,
  ListItemText
} from '@mui/material';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import {
  Notifications as NotificationsIcon,
  AccountCircle,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import Divider from '@mui/material/Divider';
import GavelIcon from '@mui/icons-material/Gavel';
import PersonIcon from '@mui/icons-material/Person';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { createSvgIcon } from '@mui/material/utils';
import { ThemeProvider } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { SearchBar } from './SearchBar/SearchBar';
import './NavBarTop.scss';
import { ReactComponent as MenuIcon } from '../../assets/scalable/menu.svg';
import { ReactComponent as NotifIcon } from '../../assets/scalable/notification.svg';
import { ReactComponent as PeopleIcon } from '../../assets/scalable/people.svg';
import { ReactComponent as NantralIcon } from '../../assets/logo/scalable/logo.svg';

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
  themeApp: boolean;
  setThemeApp: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { menuOpen, setMenuOpen, themeApp, setThemeApp } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const changeLanguage = (lng) => {
    i18next.changeLanguage(lng);
  };

  const { t } = useTranslation('translation');

  const [langue, setLangue] = React.useState('');

  const handleChangeLangue = (event: SelectChangeEvent) => {
    setLangue(event.target.value as string);
    changeLanguage(event.target.value);
  };

  return (
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
            onClick={handleClick}
          >
            <SvgIcon component={PeopleIcon} inheritViewBox />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{ 'aria-labelledby': 'basic-button' }}
          >
            <MenuItem onClick={handleClose}>
              <SvgIcon component={PersonIcon} />
              <ListItem
                component={Link}
                to="/profile/"
                className="menuItem"
                disablePadding
              >
                {t('user_menu.profile')}
              </ListItem>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <SvgIcon component={LogoutRoundedIcon} />
              <ListItem
                component={Link}
                to="/logout/"
                className="menuItem"
                disablePadding
              >
                {t('user_menu.logout')}
              </ListItem>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleClose}>
              <SvgIcon component={ErrorRoundedIcon} />
              <ListItem
                component={Link}
                to="/bug/"
                className="menuItem"
                disablePadding
              >
                {t('user_menu.bug')}
              </ListItem>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <SvgIcon component={HelpRoundedIcon} />
              <ListItem
                key={t('user_menu.doc')}
                component={Link}
                to="https://docs.nantral-platform.fr/"
                className="menuItem"
                disablePadding
              >
                {t('user_menu.doc')}
              </ListItem>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <SvgIcon component={GavelIcon} />
              <ListItem
                component={Link}
                to="/legal-notice/"
                className="menuItem"
                disablePadding
              >
                {t('user_menu.legal')}
              </ListItem>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => setThemeApp(!themeApp)}>
              <SvgIcon
                component={themeApp ? Brightness7Icon : Brightness4Icon}
              />
              <ListItemText className="menuItem">
                {!themeApp ? 'Dark' : 'Light'} Mode
              </ListItemText>
            </MenuItem>
            <MenuItem>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-label">{t('user_menu.language')}</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={langue}
                  label="Langue"
                  onChange={handleChangeLangue}
                >
                  <MenuItem value="en-GB">{t('user_menu.english')}</MenuItem>
                  <MenuItem value="fr-FR">{t('user_menu.french')}</MenuItem>
                </Select>
              </FormControl>
            </MenuItem>
          </Menu>
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
