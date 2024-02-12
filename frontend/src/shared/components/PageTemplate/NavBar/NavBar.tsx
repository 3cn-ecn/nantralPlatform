import { AppBar, Toolbar } from '@mui/material';

import { NotificationMenu } from '#modules/notification/view/NotificationMenu/NotificationMenu';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useAuth } from '#shared/context/Auth.context';

import { AppMenu } from '../AppMenu/AppMenu';
import { UserMenuAuthenticated } from '../UserMenu/UserMenuAuthenticated';
import { UserMenuUnauthenticated } from '../UserMenu/UserMenuUnauthenticated';
import { BreadcrumbsNav } from './components/BreadcrumbsNav';

declare module '@mui/material/AppBar' {
  interface AppBarPropsColorOverrides {
    neutral: true;
  }
}

export function NavBar() {
  const { isAuthenticated } = useAuth();
  return (
    <AppBar position="fixed" color="neutral">
      <Toolbar>
        {isAuthenticated && <AppMenu />}
        <BreadcrumbsNav />
        <Spacer flex={1} />
        {isAuthenticated ? (
          <>
            <NotificationMenu />
            <UserMenuAuthenticated />
          </>
        ) : (
          <UserMenuUnauthenticated />
        )}
      </Toolbar>
    </AppBar>
  );
}
