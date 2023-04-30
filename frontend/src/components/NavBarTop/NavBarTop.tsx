import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  ArrowBack as ArrowBackIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  BrightnessMedium as BrightnessMediumIcon,
  ErrorRounded as ErrorRoundedIcon,
  Gavel as GavelIcon,
  HelpRounded as HelpRoundedIcon,
  LogoutRounded as LogoutRoundedIcon,
  MoreVert as MoreIcon,
  NavigateNext as NavigateNextIcon,
  Palette as PaletteIcon,
  Person as PersonIcon,
  PublicRounded as PublicRoundedIcon,
} from '@mui/icons-material';
import {
  AppBar,
  Box,
  Breadcrumbs,
  Button,
  Collapse,
  Divider,
  Icon,
  IconButton,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  PaletteMode,
  SvgIcon,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import axios from 'axios';
import i18next from 'i18next';

import Avatar from '../Avatar/Avatar';
import { NotificationMenu } from '../NotificationMenu/NotificationMenu';
import EditSuggestionModal from '../Suggestion/Suggestion';
import { Suggestion } from '../Suggestion/interfacesSuggestion';
import './NavBarTop.scss';

declare module '@mui/material/AppBar' {
  interface AppBarPropsColorOverrides {
    neutral: true;
  }
}

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
  colorMode: PaletteMode | 'auto';
  setColorMode: React.Dispatch<React.SetStateAction<PaletteMode | 'auto'>>;
}) {
  const { menuOpen, setMenuOpen, colorMode, setColorMode } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorElLangue, setAnchorElLangue] =
    React.useState<null | HTMLElement>(null);
  const [anchorElDark, setAnchorElDark] = React.useState<null | HTMLElement>(
    null
  );
  const [loggedId, setLoggedId] = React.useState<string>();
  const [isProfilePicture, setIsProfilePicture] =
    React.useState<boolean>(false);
  const [student, setStudent] = React.useState<any>();
  const [isStaff, setIsStaff] = React.useState<boolean>(false);
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

  const [openS, setOpenS] = React.useState(false);

  const handleCloseS = () => {
    setOpenS(false);
  };

  const { t } = useTranslation('translation');
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const breadcrumbNameMap: { [key: string]: string } = {
    '/home/': t('navbar.home'),
    '/event/': t('navbar.events'),
    '/club/': t('navbar.clubs'),
    '/colocs/': t('navbar.flatshare'),
    '/parrainage/': t('navbar.family'),
    '/liste/': t('navbar.bdx'),
    '/academics/': t('navbar.academics'),
    '/administration/': t('navbar.administration'),
    '/student/': t('navbar.student'),
    '/tools/signature': t('navbar.signature'),
    '/suggestions/': 'Bug',
    '/legal_mentions/': 'Legal',
    '/event/:id/': 'Oui',
  };
  let pathnames = location.pathname.split('/').filter((x) => x);
  if (pathnames.length === 0) {
    pathnames = ['home'];
  }
  if (pathnames.length > 1 && smallScreen) {
    pathnames = [pathnames.at(-2)];
  }

  React.useEffect(() => {
    getLoggedStudent();
  }, []);

  async function getLoggedStudent() {
    axios
      .get('/api/student/student/me/')
      .then((res) => {
        setLoggedId(res.data.id.toString());
        setIsProfilePicture(res.data.picture !== null);
        setStudent(res.data);
        setIsStaff(res.data.staff);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const createSuggestion = async (suggestion: Suggestion) => {
    return axios.post('/api/home/suggestion', suggestion);
  };

  return (
    <AppBar position="fixed" color="neutral">
      <Toolbar>
        <IconButton
          color="inherit"
          onClick={() => setMenuOpen(!menuOpen)}
          size="large"
          edge="start"
          aria-label="menu"
          component="span"
        >
          <Icon>
            <img
              src="/static/img/icons/cropped/menu.svg"
              alt="Ouvrir le menu"
            />
          </Icon>
        </IconButton>
        <Breadcrumbs
          aria-label="breadcrumb"
          className="breadcrumbs"
          separator={<NavigateNextIcon fontSize="small" />}
        >
          <Button
            component={Link}
            to="/"
            variant="text"
            color="inherit"
            sx={{
              display: 'flex',
              alignItems: 'center',
              columnGap: 1,
              textTransform: 'none',
              borderRadius: '5em',
              minWidth: 'unset',
              mr: '-8px',
            }}
          >
            <Icon>
              <img src="/static/img/logo/scalable/logo.svg" alt="" />
            </Icon>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              Nantral Platform
            </Typography>
          </Button>
          {pathnames.map((value, index) => {
            const isLastItem = index === pathnames.length - 1;
            const to = `/${pathnames.slice(0, index + 1).join('/')}/`;
            return (
              <Button
                {...(isLastItem
                  ? { href: '#' }
                  : { component: Link, to: to === '/home/' ? '/' : to })}
                color="inherit"
                key={to}
                variant="text"
                sx={{
                  textTransform: 'none',
                  borderRadius: '5em',
                  ml: '-8px',
                  mr: '-8px',
                }}
              >
                <Typography variant="h6">{breadcrumbNameMap[to]}</Typography>
              </Button>
            );
          })}
        </Breadcrumbs>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex' }}>
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
            {!isProfilePicture || !student ? (
              <Icon>
                <img
                  src="/static/img/icons/cropped/people.svg"
                  alt="Ouvrir le Menu Profil"
                />
              </Icon>
            ) : (
              <Avatar title={student.name} url={student.picture} />
            )}
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{ 'aria-labelledby': 'basic-button' }}
            TransitionComponent={Collapse}
            PaperProps={{
              style: {
                width: 195,
              },
            }}
          >
            <MenuItem onClick={handleClose}>
              <SvgIcon component={PersonIcon} />
              <ListItem
                component={Link}
                to={`/student/${loggedId}`}
                className="menuItem"
                disablePadding
                sx={{
                  color: 'text.primary',
                }}
              >
                {t('user_menu.profile')}
              </ListItem>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <SvgIcon component={LogoutRoundedIcon} />
              <ListItem
                component={Link}
                to="/account/logout/"
                className="menuItem"
                reloadDocument
                disablePadding
                sx={{
                  color: 'text.primary',
                }}
              >
                {t('user_menu.logout')}
              </ListItem>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleClickL}>
              <SvgIcon component={PublicRoundedIcon} />
              <ListItemText className="menuItem">
                {t('user_menu.language')}
              </ListItemText>
              <NavigateNextIcon />
            </MenuItem>
            <MenuItem onClick={handleClickD}>
              <SvgIcon component={PaletteIcon} />
              <ListItemText className="menuItem">
                {t('user_menu.theme')}
              </ListItemText>
              <NavigateNextIcon />
            </MenuItem>
            <Divider />
            {isStaff ? (
              <MenuItem onClick={handleClose}>
                <SvgIcon component={AdminPanelSettingsIcon} />
                <ListItem
                  component={Link}
                  to="/admin/"
                  className="menuItem"
                  disablePadding
                  reloadDocument
                  sx={{
                    color: 'text.primary',
                  }}
                >
                  {t('user_menu.admin')}
                </ListItem>
              </MenuItem>
            ) : null}
            <MenuItem onClick={() => setOpenS(true)}>
              <SvgIcon component={ErrorRoundedIcon} />
              <ListItem
                className="menuItem"
                disablePadding
                sx={{
                  color: 'text.primary',
                }}
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
                sx={{
                  color: 'text.primary',
                }}
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
                sx={{
                  color: 'text.primary',
                }}
              >
                {t('user_menu.legal')}
              </ListItem>
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
                setColorMode('light');
                localStorage.setItem('theme-mode', 'light');
              }}
              selected={colorMode === 'light'}
            >
              <SvgIcon component={Brightness7Icon} />
              <ListItemText className="menuItem">
                {t('user_menu.light')}
              </ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                setColorMode('dark');
                localStorage.setItem('theme-mode', 'dark');
              }}
              selected={colorMode === 'dark'}
            >
              <SvgIcon component={Brightness4Icon} />
              <ListItemText className="menuItem">
                {t('user_menu.dark')}
              </ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                setColorMode('auto');
                localStorage.setItem('theme-mode', 'auto');
              }}
              selected={colorMode === 'auto'}
            >
              <SvgIcon component={BrightnessMediumIcon} />
              <ListItemText className="menuItem">
                {t('user_menu.automatic')}
              </ListItemText>
            </MenuItem>
          </Menu>
        </Box>
        <EditSuggestionModal
          open={openS}
          closeModal={handleCloseS}
          saveSuggestion={createSuggestion}
        />
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
