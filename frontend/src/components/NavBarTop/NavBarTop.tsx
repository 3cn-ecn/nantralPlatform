import * as React from 'react';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  IconButton,
  AppBar,
  Typography,
  Box,
  Toolbar,
  Menu,
  MenuItem,
  ListItem,
  ListItemText,
} from '@mui/material';
import SvgIcon from '@mui/material/SvgIcon';
import Collapse from '@mui/material/Collapse';
import { MoreVert as MoreIcon } from '@mui/icons-material';
import Divider from '@mui/material/Divider';
import GavelIcon from '@mui/icons-material/Gavel';
import PersonIcon from '@mui/icons-material/Person';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import BrightnessMediumIcon from '@mui/icons-material/BrightnessMedium';
import PaletteIcon from '@mui/icons-material/Palette';
import { SearchBar } from './SearchBar/SearchBar';
import { NotificationMenu } from '../NotificationMenu/NotificationMenu';
import './NavBarTop.scss';
import { ReactComponent as MenuIcon } from '../../assets/scalable/menu.svg';
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
  isAutomatic: boolean;
  setIsAutomatic: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    menuOpen,
    setMenuOpen,
    themeApp,
    setThemeApp,
    isAutomatic,
    setIsAutomatic,
  } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorElLangue, setAnchorElLangue] =
    React.useState<null | HTMLElement>(null);
  const [anchorElDark, setAnchorElDark] = React.useState<null | HTMLElement>(
    null
  );
  const open = Boolean(anchorEl);
  const openL = Boolean(anchorElLangue);
  const openD = Boolean(anchorElDark);
  const spanRef = React.useRef();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClickL = () => {
    setAnchorElLangue(spanRef.current);
    setAnchorEl(null);
  };
  const handleCloseL = () => {
    setAnchorElLangue(null);
    setAnchorEl(spanRef.current);
  };
  const handleCloseLAll = () => {
    setAnchorElLangue(null);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickD = () => {
    setAnchorElDark(spanRef.current);
    setAnchorEl(null);
  };
  const handleCloseD = () => {
    setAnchorElDark(null);
    setAnchorEl(spanRef.current);
  };
  const handleCloseDAll = () => {
    setAnchorElDark(null);
  };

  const { t } = useTranslation('translation');

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
        <Typography
          variant="h6"
          component="div"
          color="TextPrimary"
          sx={{ display: { xs: 'none', md: 'flex' } }}
        >
          Nantral Platform
        </Typography>
        <Box sx={{ flexGrow: 0.9 }} />
        <SearchBar />
        <Box sx={{ flexGrow: 1.0 }} />
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <NotificationMenu />
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            color="inherit"
            onClick={handleClick}
            component="span"
            ref={spanRef}
          >
            <SvgIcon component={PeopleIcon} inheritViewBox />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{ 'aria-labelledby': 'basic-button' }}
            TransitionComponent={Collapse}
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
            <MenuItem onClick={handleClickL}>
              <SvgIcon component={PublicRoundedIcon} />
              <ListItemText className="menuItem">
                {t('user_menu.language')}
              </ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleClickD}>
              <SvgIcon component={PaletteIcon} />
              <ListItemText className="menuItem">
                {t('user_menu.theme')}
              </ListItemText>
            </MenuItem>
          </Menu>
          <Menu
            id="basic-menu"
            anchorEl={anchorElLangue}
            open={openL}
            onClose={handleCloseLAll}
            MenuListProps={{ 'aria-labelledby': 'basic-button' }}
            TransitionComponent={Collapse}
            PaperProps={{
              style: {
                width: 195,
              },
            }}
          >
            <ListItem>
              <IconButton
                aria-label="account of current user"
                aria-haspopup="true"
                color="inherit"
                onClick={handleCloseL}
              >
                <SvgIcon component={ArrowBackIcon} inheritViewBox />
              </IconButton>
              <Typography className="menuTitle" variant="h6">
                {t('user_menu.title_language')}
              </Typography>
            </ListItem>
            <MenuItem
              value="fr-FR"
              onClick={() => {
                i18next.changeLanguage('fr-FR');
              }}
              selected={i18next.language === 'fr-FR'}
            >
              Français
            </MenuItem>
            <MenuItem
              value="en-GB"
              onClick={() => {
                i18next.changeLanguage('en-GB');
              }}
              selected={i18next.language === 'en-GB'}
            >
              English
            </MenuItem>
          </Menu>
          <Menu
            id="menu-dark-mode"
            anchorEl={anchorElDark}
            open={openD}
            onClose={handleCloseDAll}
            MenuListProps={{ 'aria-labelledby': 'basic-button' }}
            TransitionComponent={Collapse}
            PaperProps={{
              style: {
                width: 195,
              },
            }}
          >
            <ListItem>
              <IconButton
                aria-label="account of current user"
                aria-haspopup="true"
                color="inherit"
                onClick={handleCloseD}
              >
                <SvgIcon component={ArrowBackIcon} inheritViewBox />
              </IconButton>
              <Typography className="menuTitle" variant="h6">
                {t('user_menu.title_theme')}
              </Typography>
            </ListItem>
            <MenuItem
              onClick={() => {
                setThemeApp(true);
                setIsAutomatic(false);
                localStorage.setItem('theme-auto', JSON.stringify(false));
                localStorage.setItem('theme-mode', JSON.stringify(true));
              }}
              selected={themeApp === true && isAutomatic === false}
            >
              <SvgIcon component={Brightness7Icon} />
              <ListItemText className="menuItem">
                {t('user_menu.light')}
              </ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                setThemeApp(false);
                setIsAutomatic(false);
                localStorage.setItem('theme-auto', JSON.stringify(false));
                localStorage.setItem('theme-mode', JSON.stringify(false));
              }}
              selected={themeApp === false && isAutomatic === false}
            >
              <SvgIcon component={Brightness4Icon} />
              <ListItemText className="menuItem">
                {t('user_menu.dark')}
              </ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                setIsAutomatic(true);
                localStorage.setItem('theme-auto', JSON.stringify(true));
              }}
              selected={isAutomatic === true}
            >
              <SvgIcon component={BrightnessMediumIcon} />
              <ListItemText className="menuItem">
                {t('user_menu.automatic')}
              </ListItemText>
            </MenuItem>
          </Menu>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'none' } }}>
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
