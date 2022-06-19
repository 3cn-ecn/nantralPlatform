import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  CSSObject,
  IconButton,
  SvgIcon,
  Theme,
  Drawer as MuiDrawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  InsertLink as InsertLinkIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Event as EventIcon,
  Map as ColocIcon,
  Groups as ClubIcon,
} from '@mui/icons-material';
import { styled, useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';

interface buttonInterface {
  text: string;
  url: string;
  icon?: any;
  onBackend?: boolean;
}

const buttons: buttonInterface[] = [
  {
    text: 'post',
    url: '/home/',
    icon: EventIcon,
    onBackend: true,
  },
  {
    text: 'club',
    url: '/club/',
    icon: ClubIcon,
    onBackend: true,
  },
  {
    text: 'coloc',
    url: '/colocs/',
    icon: ColocIcon,
    onBackend: true,
  },
  {
    text: 'jsp',
    url: '/test1',
  },
  {
    text: 'trop bi1',
    url: '/test2',
  },
  {
    text: 'ok',
    url: '/',
  },
];

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

function Sidebar(props) {
  const theme = useTheme();
  const { t } = useTranslation('translation');

  return (
    <Drawer variant="permanent" open={props.open}>
      <DrawerHeader>
        <IconButton onClick={props.handleDrawerClose}>
          {theme.direction === 'rtl' ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {buttons.map((button, index) => (
          <ListItem
            key={button.text}
            disablePadding
            sx={{ display: 'block' }}
            component={Link}
            to={button.url}
            reloadDocument={button.onBackend}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {button.icon ? <button.icon /> : <InsertLinkIcon />}
              </ListItemIcon>
              <ListItemText
                primary={t('navbar.' + button.text)}
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;
