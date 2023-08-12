import { Dispatch, SetStateAction } from 'react';

import { AppBar, Icon, IconButton, Toolbar } from '@mui/material';

import { Spacer } from '#shared/components/Spacer/Spacer';

import { NotificationMenu } from '../NotificationMenu/NotificationMenu';
import { BreadcrumbsNav } from './BreadcrumbsNav';
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

export function NavBarTop({ menuOpen, setMenuOpen }: NavBarTopProps) {
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
        <BreadcrumbsNav />
        <Spacer flex={1} />
        <NotificationMenu />
        <UserMenu />
      </Toolbar>
    </AppBar>
  );
}
