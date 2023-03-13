import * as React from 'react';
import {
  Box,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  SvgIcon,
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './NavBarSide.scss';
import { ReactComponent as EventIcon } from '../../assets/scalable/event.svg';
import { ReactComponent as ClubIcon } from '../../assets/scalable/club.svg';
import { ReactComponent as MapIcon } from '../../assets/scalable/roommates.svg';
import { ReactComponent as FamilyIcon } from '../../assets/scalable/family.svg';
import { ReactComponent as CampaignIcon } from '../../assets/scalable/campaign.svg';
import { ReactComponent as LibraryIcon } from '../../assets/scalable/library.svg';
import { ReactComponent as AdminIcon } from '../../assets/scalable/admin.svg';
import { ReactComponent as ListIcon } from '../../assets/scalable/list.svg';
import { ReactComponent as SignIcon } from '../../assets/scalable/sign.svg';
import { ReactComponent as LinkIcon } from '../../assets/scalable/link.svg';
import { ReactComponent as AcademicIcon } from '../../assets/scalable/academic.svg';

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
  const { t } = useTranslation('translation'); // translation module

  const links: LinksInterface[] = [
    {
      text: t('navbar.home'),
      url: '/',
      icon: AcademicIcon,
    },
    {
      text: t('navbar.events'),
      url: '/event/',
      icon: EventIcon,
    },
    {
      text: t('navbar.clubs'),
      url: '/group/club/',
      icon: ClubIcon,
      isOnBackend: true,
    },
    {
      text: t('navbar.flatshare'),
      url: '/colocs/',
      icon: MapIcon,
      isOnBackend: true,
    },
    {
      text: t('navbar.family'),
      url: '/parrainage/',
      icon: FamilyIcon,
      isOnBackend: true,
    },
    {
      text: t('navbar.bdx'),
      url: '/group/liste/',
      icon: CampaignIcon,
      isOnBackend: true,
    },
    {
      text: t('navbar.academics'),
      url: '/group/academic/',
      icon: LibraryIcon,
      isOnBackend: true,
    },
    {
      text: t('navbar.administration'),
      url: '/group/admin/',
      icon: AdminIcon,
      isOnBackend: true,
    },
    {
      text: t('navbar.student'),
      url: '/student/',
      icon: ListIcon,
      isOnBackend: true,
    },
    {
      text: t('navbar.signature'),
      url: '/tools/signature/',
      icon: SignIcon,
      isOnBackend: true,
    },
  ];

  return (
    <Drawer
      variant={variant}
      open={menuOpen}
      anchor="left"
      onAbort={onClose}
      onAbortCapture={onClose}
      onAuxClick={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
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
                  {link.icon ? (
                    <SvgIcon component={link.icon} inheritViewBox />
                  ) : (
                    <SvgIcon component={LinkIcon} inheritViewBox />
                  )}
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
