import { AppBar, Toolbar } from '@mui/material';

import { NotificationMenu } from '#modules/notification/view/NotificationMenu/NotificationMenu';
import { Spacer } from '#shared/components/Spacer/Spacer';

import { AppMenu } from './AppMenu';
import { BreadcrumbsNav } from './BreadcrumbsNav';
import { UserMenu } from './UserMenu';

declare module '@mui/material/AppBar' {
  interface AppBarPropsColorOverrides {
    neutral: true;
  }
}

export function NavBarTop() {
  return (
    <AppBar position="fixed" color="neutral">
      <Toolbar>
        <AppMenu />
        <BreadcrumbsNav />
        <Spacer flex={1} />
        <NotificationMenu />
        <UserMenu />
      </Toolbar>
    </AppBar>
  );
}
