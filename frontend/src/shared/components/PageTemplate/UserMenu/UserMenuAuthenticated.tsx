import { MouseEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  DarkMode as DarkModeIcon,
  FeedbackOutlined as FeedbackIcon,
  Gavel as LegalIcon,
  LogoutRounded as LogoutIcon,
  MenuBook as MenuBookIcon,
  NavigateNext as NavigateNextIcon,
  Person as PersonIcon,
  Translate as TranslateIcon,
} from '@mui/icons-material';
import { Collapse, Divider, Icon, IconButton, Menu } from '@mui/material';

import { useCurrentUserData } from '#modules/account/hooks/useCurrentUser.data';
import { Avatar } from '#shared/components/Avatar/Avatar';
import { useAuth } from '#shared/context/Auth.context';
import { useTranslation } from '#shared/i18n/useTranslation';

import { LangSubMenu } from './components/LangSubMenu';
import { ThemeSubMenu } from './components/ThemeSubMenu';
import { UserMenuItem } from './components/UserMenuItem';

export function UserMenuAuthenticated() {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState<null | 'main' | 'theme' | 'lang'>(
    null,
  );

  const currentUser = useCurrentUserData();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen('main');
  };
  const { logout } = useAuth();

  return (
    <>
      <IconButton
        size="large"
        edge="end"
        aria-label={t('userMenu.button.label')}
        aria-haspopup="true"
        onClick={handleClick}
        sx={currentUser.picture ? { p: 0.5 } : {}}
      >
        {currentUser.picture ? (
          <Avatar alt={currentUser.name} src={currentUser.picture} />
        ) : (
          <Icon
            component="img"
            src="/static/img/icons/cropped/people.svg"
            alt="Ouvrir le Menu Profil"
          />
        )}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen === 'main'}
        onClose={() => setMenuOpen(null)}
        TransitionComponent={Collapse}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { minWidth: 200 } } }}
      >
        <UserMenuItem
          label={t('userMenu.menu.profile')}
          icon={<PersonIcon />}
          component={Link}
          to={`/student/${currentUser.id}`}
          onClick={() => setMenuOpen(null)}
        />
        <UserMenuItem
          label={t('userMenu.menu.signOut')}
          icon={<LogoutIcon />}
          onClick={() => {
            logout();
          }}
        />
        <Divider />
        <UserMenuItem
          label={t('userMenu.menu.language.title')}
          icon={<TranslateIcon />}
          rightIcon={<NavigateNextIcon />}
          onClick={() => setMenuOpen('lang')}
        />
        <UserMenuItem
          label={t('userMenu.menu.theme.title')}
          icon={<DarkModeIcon />}
          rightIcon={<NavigateNextIcon />}
          onClick={() => setMenuOpen('theme')}
        />
        <Divider />
        {currentUser.staff && (
          <UserMenuItem
            label={t('userMenu.menu.adminInterface')}
            icon={<AdminPanelSettingsIcon />}
            component="a"
            href="/admin"
            target="_blank"
            onClick={() => setMenuOpen(null)}
          />
        )}
        <UserMenuItem
          label={t('userMenu.menu.documentation')}
          icon={<MenuBookIcon />}
          component={Link}
          to="https://docs.nantral-platform.fr/"
          reloadDocument
          onClick={() => setMenuOpen(null)}
        />
        <UserMenuItem
          label={t('userMenu.menu.feedback')}
          icon={<FeedbackIcon />}
          component={Link}
          to="/feedback"
          onClick={() => setMenuOpen(null)}
        />
        <UserMenuItem
          label={t('userMenu.menu.legalNotice')}
          icon={<LegalIcon />}
          component={Link}
          to="/legal-notice/"
          onClick={() => setMenuOpen(null)}
        />
      </Menu>
      <LangSubMenu
        anchorEl={anchorEl}
        isOpen={menuOpen === 'lang'}
        onGoBack={() => setMenuOpen('main')}
        onClose={() => setMenuOpen(null)}
      />
      <ThemeSubMenu
        anchorEl={anchorEl}
        isOpen={menuOpen === 'theme'}
        onGoBack={() => setMenuOpen('main')}
        onClose={() => setMenuOpen(null)}
      />
    </>
  );
}
