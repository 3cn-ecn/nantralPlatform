import { AppBar, Toolbar } from '@mui/material';

import { NotificationMenu } from '#modules/notification/view/NotificationMenu/NotificationMenu';
import { Spacer } from '#shared/components/Spacer/Spacer';

import { AppMenu } from '../AppMenu/AppMenu';
import { UserMenuAuthenticated } from '../UserMenu/UserMenuAuthenticated';
import { BreadcrumbsNav } from './components/BreadcrumbsNav';

declare module '@mui/material/AppBar' {
  interface AppBarPropsColorOverrides {
    neutral: true;
  }
}

export function NavBar() {
  return (
    <AppBar position="fixed" color="neutral">
      <Toolbar>
        <AppMenu />
        <BreadcrumbsNav />
        <Spacer flex={1} />
        <NotificationMenu />
        <UserMenuAuthenticated />
      </Toolbar>
    </AppBar>
  );
}
