import { Dispatch, SetStateAction } from 'react';
import { Link, useMatches } from 'react-router-dom';

import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Breadcrumbs,
  Button,
  Icon,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';

import { useTranslation } from '#shared/i18n/useTranslation';

import { NotificationMenu } from '../NotificationMenu/NotificationMenu';
import './NavBarTop.scss';
import { UserMenu } from './UserMenu';

declare module '@mui/material/AppBar' {
  interface AppBarPropsColorOverrides {
    neutral: true;
  }
}

type NavBarTopProps = {
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
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
function NavBarTop({ menuOpen, setMenuOpen }: NavBarTopProps) {
  const matches = useMatches();

  const { t } = useTranslation();

  const crumbs = matches
    .filter((match) => (match.handle as { crumb?: string })?.crumb)
    .map((match) => ({
      id: match.id,
      label: t((match.handle as { crumb: string }).crumb),
      path: match.pathname,
    }));

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
          <UserMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBarTop;
