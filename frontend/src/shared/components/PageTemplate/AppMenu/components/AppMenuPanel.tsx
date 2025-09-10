import { Drawer, List, Toolbar } from '@mui/material';

import { useTranslation } from '#shared/i18n/useTranslation';

import { AppMenuItem } from './AppMenuItem';

interface AppMenuPanelProps {
  menuOpen: boolean;
  onClose: () => void;
}

export function AppMenuPanel({ menuOpen, onClose }: AppMenuPanelProps) {
  const { t } = useTranslation();

  return (
    <Drawer
      open={menuOpen}
      onClose={onClose}
      sx={{
        zIndex: 1050,
        ['& .MuiDrawer-paper']: {
          width: 240,
        },
      }}
    >
      <Toolbar />
      <List>
        <AppMenuItem
          label={t('navbar.home')}
          path="/"
          iconPath="/static/img/icons/cropped/home.svg"
          closeMenu={onClose}
        />
        <AppMenuItem
          label={t('navbar.events')}
          path="/event/"
          iconPath="/static/img/icons/cropped/event.svg"
          closeMenu={onClose}
        />
        <AppMenuItem
          label={t('navbar.group')}
          path="/group/"
          iconPath="/static/img/icons/cropped/club.svg"
          closeMenu={onClose}
        />
        <AppMenuItem
          label={t('navbar.map')}
          path="/map/?type=colocs"
          iconPath="/static/img/icons/cropped/roommates.svg"
          closeMenu={onClose}
        />
        <AppMenuItem
          label={t('navbar.family')}
          path="/parrainage/"
          iconPath="/static/img/icons/cropped/family.svg"
          isOnBackend
          closeMenu={onClose}
        />
        <AppMenuItem
          label={t('navbar.student')}
          path="/student/"
          iconPath="/static/img/icons/cropped/list.svg"
          closeMenu={onClose}
        />
        <AppMenuItem
          label={t('navbar.signature')}
          path="/signature/"
          iconPath="/static/img/icons/cropped/sign.svg"
          closeMenu={onClose}
        />
      </List>
    </Drawer>
  );
}
