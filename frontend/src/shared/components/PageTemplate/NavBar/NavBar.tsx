import { AppBar, Toolbar, useTheme } from '@mui/material';

import { NotificationMenu } from '#modules/notification/view/NotificationMenu/NotificationMenu';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useAuth } from '#shared/context/Auth.context';

import { UserMenuAuthenticated } from '../UserMenu/UserMenuAuthenticated';
import { UserMenuUnauthenticated } from '../UserMenu/UserMenuUnauthenticated';
import { BreadcrumbsNav } from './components/BreadcrumbsNav';
import { SidebarTrigger } from './components/SidebarTrigger';

declare module '@mui/material/AppBar' {
  interface AppBarPropsColorOverrides {
    neutral: true;
  }
}

export function NavBar({
  open,
  setSidebarOpen,
  isDesktop,
}: Readonly<{
  open: boolean;
  setSidebarOpen: (open: boolean) => void;
  isDesktop: boolean;
}>) {
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  return (
    <AppBar
      position="fixed"
      color="neutral"
      sx={{
        borderBottom: `1px solid ${theme.palette.appShell.sidebarBorder}`,
      }}
    >
      <Toolbar>
        <SidebarTrigger
          open={open}
          isDesktop={isDesktop}
          setSidebarOpen={setSidebarOpen}
        />
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
