import {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useQueryClient } from 'react-query';
import { Link, useMatches } from 'react-router-dom';

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
  useTheme,
} from '@mui/material';
import axios from 'axios';

import { Avatar } from '#shared/components/Avatar/Avatar';
import EditSuggestionModal from '#shared/components/Suggestion/Suggestion';
import { Suggestion } from '#shared/components/Suggestion/interfacesSuggestion';
import { languages } from '#shared/i18n/config';
import { useTranslation } from '#shared/i18n/useTranslation';
import { getNativeLanguageName } from '#shared/utils/getNativeLanguageName';

import { NotificationMenu } from '../NotificationMenu/NotificationMenu';
import './NavBarTop.scss';

declare module '@mui/material/AppBar' {
  interface AppBarPropsColorOverrides {
    neutral: true;
  }
}

type NavBarTopProps = {
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
  colorMode: PaletteMode | 'auto';
  setColorMode: Dispatch<SetStateAction<PaletteMode | 'auto'>>;
};

/**
 * The top bar for navigation
 *
 * @param props Component Properties
 * @param {boolean} props.menuOpen - A boolean to indicate if the lateral menu
 * is open or not.
 * @params props.setMenuOpen - A function to change the state of the menu.
 * @returns The top bar component
 */
function NavBarTop({
  menuOpen,
  setMenuOpen,
  colorMode,
  setColorMode,
}: NavBarTopProps) {
  const matches = useMatches();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorElLangue, setAnchorElLangue] = useState<null | HTMLElement>(
    null
  );
  const [anchorElDark, setAnchorElDark] = useState<null | HTMLElement>(null);
  const [loggedId, setLoggedId] = useState<string>();
  const [isProfilePicture, setIsProfilePicture] = useState<boolean>(false);
  const [student, setStudent] = useState<any>();
  const [isStaff, setIsStaff] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const open = Boolean(anchorEl);
  const openL = Boolean(anchorElLangue);
  const openD = Boolean(anchorElDark);
  const spanRef = useRef(null);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
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

  const [openS, setOpenS] = useState(false);

  const handleCloseS = () => {
    setOpenS(false);
  };

  const { t, i18n } = useTranslation();
  const theme = useTheme();

  const crumbs = matches
    .filter((match) => (match.handle as { crumb?: string })?.crumb)
    .map((match) => ({
      id: match.id,
      label: t((match.handle as { crumb: string }).crumb),
      path: match.pathname,
    }));

  useEffect(() => {
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
          {crumbs.map((crumb) => {
            return (
              <Button
                component={Link}
                to={crumb.path}
                color="inherit"
                key={crumb.path}
                variant="text"
                sx={{
                  textTransform: 'none',
                  borderRadius: '5em',
                  ml: '-8px',
                  mr: '-8px',
                }}
              >
                <Typography variant="h6">{crumb.label}</Typography>
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
              <Avatar alt={student.name} src={student.picture} />
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
            {languages.map((lng) => (
              <MenuItem
                key={lng}
                value={lng}
                onClick={() => {
                  i18n.changeLanguage(lng);
                  queryClient.invalidateQueries();
                }}
                selected={i18n.language === lng}
              >
                {getNativeLanguageName(lng)}
              </MenuItem>
            ))}
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
