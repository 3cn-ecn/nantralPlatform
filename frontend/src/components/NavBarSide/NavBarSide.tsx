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
  SvgIcon,
  createSvgIcon,
} from '@mui/material';
import { InsertLink as InsertLinkIcon } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './NavBarSide.scss';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../theme';
import { ReactComponent as MenuIcon } from '../../assets/scalable/menu.svg';
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
import { ReactComponent as NantralIcon } from '../../assets/logo/scalable/logo.svg';

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
      icon: NantralIcon,
    },
    {
      text: t('navbar.events'),
      url: '/event/',
      icon: EventIcon,
    },
    {
      text: t('navbar.clubs'),
      url: '/club/',
      icon: ClubIcon,
    },
    {
      text: t('navbar.flatshare'),
      url: '/colocs/',
      icon: MapIcon,
    },
    {
      text: t('navbar.patronage'),
      url: '/parrainage/',
      icon: FamilyIcon,
    },
    {
      text: t('navbar.bdx'),
      url: '/liste/',
      icon: CampaignIcon,
    },
    {
      text: t('navbar.academics'),
      url: '/academics/',
      icon: LibraryIcon,
    },
    {
      text: t('navbar.administration'),
      url: '/administration/',
      icon: AdminIcon,
    },
    {
      text: t('navbar.student'),
      url: '/student/',
      icon: ListIcon,
    },
    {
      text: t('navbar.signature'),
      url: '/tools/signature/',
      icon: SignIcon,
      isOnBackend: true,
    },
  ];

  return (
    <ThemeProvider theme={theme}>
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
                    {link.icon ? (
                      <SvgIcon component={link.icon} inheritViewBox />
                    ) : (
                      <SvgIcon component={LinkIcon} inheritViewBox />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={link.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </ThemeProvider>
  );
}

export default NavBarSide;
