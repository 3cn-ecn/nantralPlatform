import { NavLink } from 'react-router-dom';

import {
  Drawer,
  Icon,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';

import { useTranslation } from '#shared/i18n/useTranslation';

interface NavBarSideProps {
  menuOpen: boolean;
  onClose: () => void;
}

export function NavBarSide({ menuOpen, onClose }: NavBarSideProps) {
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
        <NavBarSideItem
          label={t('navbar.home')}
          path="/"
          iconPath="/static/img/icons/cropped/home.svg"
          closeMenu={onClose}
        />
        <NavBarSideItem
          label={t('navbar.events')}
          path="/event/"
          iconPath="/static/img/icons/cropped/event.svg"
          closeMenu={onClose}
        />
        <NavBarSideItem
          label={t('navbar.group')}
          path="/group/"
          iconPath="/static/img/icons/cropped/club.svg"
          isOnBackend
          closeMenu={onClose}
        />
        <NavBarSideItem
          label={t('navbar.flatshare')}
          path="/colocs/"
          iconPath="/static/img/icons/cropped/roommates.svg"
          isOnBackend
          closeMenu={onClose}
        />
        <NavBarSideItem
          label={t('navbar.family')}
          path="/parrainage/"
          iconPath="/static/img/icons/cropped/family.svg"
          isOnBackend
          closeMenu={onClose}
        />
        <NavBarSideItem
          label={t('navbar.student')}
          path="/student/"
          iconPath="/static/img/icons/cropped/list.svg"
          isOnBackend
          closeMenu={onClose}
        />
        <NavBarSideItem
          label={t('navbar.signature')}
          path="/tools/signature/"
          iconPath="/static/img/icons/cropped/sign.svg"
          closeMenu={onClose}
        />
      </List>
    </Drawer>
  );
}

interface NavBarSideItemProps {
  label: string;
  path: string;
  iconPath?: string;
  isOnBackend?: boolean;
  closeMenu: () => void;
}

function NavBarSideItem({
  label,
  path,
  iconPath = '/static/img/icons/cropped/link.svg',
  isOnBackend = false,
  closeMenu,
}: NavBarSideItemProps) {
  return (
    <ListItem disablePadding>
      <ListItemButton
        component={NavLink}
        to={path}
        reloadDocument={isOnBackend}
        onClick={closeMenu}
        sx={{
          '&.active': {
            color: 'primary.main',
            '& span': { fontWeight: 500 },
          },
        }}
      >
        <ListItemIcon>
          <Icon component="img" src={iconPath} alt="" />
        </ListItemIcon>
        <ListItemText>{label}</ListItemText>
      </ListItemButton>
    </ListItem>
  );
}
