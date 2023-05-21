import React from 'react';
import { NavLink } from 'react-router-dom';

import {
  Box,
  Drawer,
  Icon,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Toolbar,
} from '@mui/material';

import { useTranslation } from '#shared/i18n/useTranslation';

import './NavBarSide.scss';

/** Interface for all links */
interface LinksInterface {
  text: string; // the text of the link
  url: string;
  icon?: any;
  isOnBackend?: boolean; // true if the page is not in the React application
}

/**
 * The side bar for navigation
 *
 * @param props Component Properties
 * @param {boolean} props.menuOpen - A boolean to indicate if the lateral menu
 * is open or not.
 * @params props.drawerWidth - The width that the drawer should be.
 * @returns The side bar component
 */
function NavBarSide(props: {
  menuOpen: boolean;
  drawerWidth: number;
  variant: 'permanent' | 'persistent' | 'temporary';
  onClose: () => any;
}) {
  const { menuOpen, drawerWidth, variant, onClose } = props;
  const { t } = useTranslation(); // translation module

  const links: LinksInterface[] = [
    {
      text: t('navbar.home'),
      url: '/',
      icon: '/static/img/icons/cropped/home.svg',
    },
    {
      text: t('navbar.events'),
      url: '/event/',
      icon: '/static/img/icons/cropped/event.svg',
    },
    {
      text: t('navbar.group'),
      url: '/group/',
      icon: '/static/img/icons/cropped/club.svg',
      isOnBackend: true,
    },
    {
      text: t('navbar.flatshare'),
      url: '/colocs/',
      icon: '/static/img/icons/cropped/roommates.svg',
      isOnBackend: true,
    },
    {
      text: t('navbar.family'),
      url: '/parrainage/',
      icon: '/static/img/icons/cropped/family.svg',
      isOnBackend: true,
    },
    {
      text: t('navbar.student'),
      url: '/student/',
      icon: '/static/img/icons/cropped/list.svg',
      isOnBackend: true,
    },
    {
      text: t('navbar.signature'),
      url: '/tools/signature/',
      icon: '/static/img/icons/cropped/sign.svg',
      isOnBackend: true,
    },
  ];

  return (
    <Drawer
      variant={variant}
      open={menuOpen}
      anchor="left"
      onClick={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        ['& .MuiDrawer-paper']: {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
        zIndex: 0,
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {links.map((link) => (
            <ListItem
              key={link.text}
              disablePadding
              component={NavLink}
              to={link.url}
              reloadDocument={link.isOnBackend}
              className="navlink"
              sx={{
                color: 'text.primary',
              }}
            >
              <ListItemButton onClick={onClose}>
                <ListItemIcon>
                  <Icon>
                    <img
                      src={link.icon ?? '/static/img/icons/cropped/link.svg'}
                      alt=""
                    />
                  </Icon>
                </ListItemIcon>
                {link.text}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

export default NavBarSide;
