import { MouseEvent, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
  DarkMode as DarkModeIcon,
  Gavel as LegalIcon,
  Login as LoginIcon,
  MenuBook as MenuBookIcon,
  NavigateNext as NavigateNextIcon,
  Translate as TranslateIcon,
} from '@mui/icons-material';
import { Collapse, Divider, Icon, IconButton, Menu } from '@mui/material';

import { useTranslation } from '#shared/i18n/useTranslation';

import { LangSubMenu } from './components/LangSubMenu';
import { ThemeSubMenu } from './components/ThemeSubMenu';
import { UserMenuItem } from './components/UserMenuItem';

export function UserMenuUnauthenticated() {
  const { t } = useTranslation();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState<null | 'main' | 'theme' | 'lang'>(
    null,
  );

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen('main');
  };

  return (
    <>
      <IconButton
        size="large"
        edge="end"
        aria-label={t('userMenu.button.label')}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <Icon
          component="img"
          src="/static/img/icons/cropped/people.svg"
          alt="Ouvrir le Menu Profil"
        />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen === 'main'}
        onClose={() => setMenuOpen(null)}
        slots={{ transition: Collapse }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { minWidth: 200 } } }}
      >
        <UserMenuItem
          label={t('userMenu.menu.signIn')}
          icon={<LoginIcon />}
          component={Link}
          to="/login/"
          onClick={() => setMenuOpen(null)}
          state={{ from: location }}
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
        <UserMenuItem
          label={t('userMenu.menu.documentation')}
          icon={<MenuBookIcon />}
          component={Link}
          to="https://docs.nantral-platform.fr/"
          reloadDocument
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
