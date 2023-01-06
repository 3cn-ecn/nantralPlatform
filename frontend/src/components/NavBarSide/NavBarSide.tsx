import * as React from 'react';
import {
  Box,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  InsertLink as InsertLinkIcon,
  Event as EventIcon,
  Map as ColocIcon,
  Groups as ClubIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './NavBarSide.scss';

/** Interface for all links */
interface linksInterface {
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
function NavBarSide(props: { menuOpen: boolean; drawerWidth: number }) {
  const { menuOpen, drawerWidth } = props;
  const { t } = useTranslation('translation'); // translation module

  const links: linksInterface[] = [
    {
      text: t('navbar.home'),
      url: '/',
      icon: HomeIcon,
    },
    {
      text: t('navbar.events'),
      url: '/home/',
      icon: EventIcon,
      isOnBackend: true,
    },
    {
      text: t('navbar.clubs'),
      url: '/club/',
      icon: ClubIcon,
      isOnBackend: true,
    },
    {
      text: t('navbar.flatshare'),
      url: '/colocs/',
      icon: ColocIcon,
      isOnBackend: true,
    },
    {
      text: 'test1',
      url: '/test1/',
    },
    {
      text: 'Lien',
      url: '/lien/',
    },
  ];

  return (
    <Drawer
      variant="persistent"
      open={menuOpen}
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
        zIndex: '1000',
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
            >
              <ListItemButton>
                <ListItemIcon>
                  {link.icon ? <link.icon /> : <InsertLinkIcon />}
                </ListItemIcon>
                <ListItemText primary={link.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

export default NavBarSide;
