import * as React from 'react';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { NavLink, Link } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  IconButton,
  AppBar,
  Typography,
  Box,
  Badge,
  Toolbar,
  Menu,
  MenuItem,
  ListItem,
  ListItemText,
} from '@mui/material';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import Collapse from '@mui/material/Collapse';
import {
  Notifications as NotificationsIcon,
  AccountCircle,
  MoreVert as MoreIcon,
} from '@mui/icons-material';
import Divider from '@mui/material/Divider';
import GavelIcon from '@mui/icons-material/Gavel';
import PersonIcon from '@mui/icons-material/Person';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { createSvgIcon } from '@mui/material/utils';
import { ThemeProvider } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import BrightnessMediumIcon from '@mui/icons-material/BrightnessMedium';
import PaletteIcon from '@mui/icons-material/Palette';
import { ReactComponent as MenuIcon } from '../../assets/scalable/menu.svg';
import { ReactComponent as NotifIcon } from '../../assets/scalable/notification.svg';
import { ReactComponent as PeopleIcon } from '../../assets/scalable/people.svg';
import { ReactComponent as NantralIcon } from '../../assets/logo/scalable/logo.svg';
import { NotificationItem } from './NotificationItem';
import axios from '../../legacy/utils/axios';
import formatUrl from '../../legacy/utils/formatUrl';
import merge from '../../legacy/notification/utils';

interface Notification {
  id: number;
  title: string;
  body: string;
  url: string;
  icon_url: string;
  date: Date;
  high_priority: boolean;
  action1_label: string;
  action1_url: string;
  action2_label: string;
  action2_url: string;
}

interface SentNotification {
  notification: Notification;
  subscribed: boolean;
  seen: boolean;
}

export function NotificationMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    getListNotifs();
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [onLoad, setOnLoad] = React.useState<boolean>(true);
  const [notifOnLoad, setNotifOnLoad] = React.useState<boolean>(false);
  const [nbNotifs, setNbNotifs] = React.useState<number>(null);
  const [listNotifs, setListNotifs] = React.useState<SentNotification[]>([]);
  const [subscribeFilter, setSubscribeFilter] = React.useState<boolean>(false);
  const [unseenFilter, setUnseenFilter] = React.useState<boolean>(false);
  const [allLoaded, setAllLoaded] = React.useState<boolean>(false);
  const [askPermissionBanner, setAskPermissionBanner] = React.useState<boolean>(
    !!('Notification' in window && Notification.permission === 'default')
  );
  const step = 10;
  const app = '/api/notification/';
  const REGISTER_URL = `${app}register`;
  const SUBSCRIPTION_URL = `${app}subscription/{0}`;
  const GET_NOTIFICATIONS_URL = `${app}get_notifications`;
  const MANAGE_NOTIFICATION_URL = `${app}notification/{0}`;

  if (nbNotifs === null) {
    getNbNotifs();
  }

  async function getNbNotifs(): Promise<void> {
    const url = formatUrl(GET_NOTIFICATIONS_URL, [], { mode: 1 });
    fetch(url)
      .then((resp) => resp.json().then((data) => setNbNotifs(data)))
      .catch((err) => setNbNotifs(null));
  }

  async function getListNotifs(): Promise<void> {
    const start = listNotifs.length;
    const url = '/api/notification/get_notifications?mode=2';
    const response = await axios.get(url);
    if (listNotifs.length !== nbNotifs) {
      const merging = merge(listNotifs, response.data);
      setListNotifs(merging);
    }
  }

  function askPermission(event): void {
    Notification.requestPermission().then(() => {
      setAskPermissionBanner(Notification.permission === 'default');
    });
  }

  async function loadNotifications(nextShow: boolean, meta: any) {
    if (onLoad) getListNotifs();
  }
  console.log(listNotifs);
  let content;
  const listToShow = listNotifs.filter((sn: SentNotification) => {
    const res = true;
    return res;
  });
  console.log('a');
  console.log(listToShow);
  console.log(listToShow.length === 0);
  if (listToShow.length === 0) {
    if (!onLoad) {
      content = (
        <MenuItem>
          <ListItem>{listToShow.length} 😢</ListItem>
        </MenuItem>
      );
    }
  } else {
    content = listToShow.map((sn) => (
      <NotificationItem key={sn.notification.id} sn={sn} />
    ));
  }
  return (
    <>
      <IconButton
        size="large"
        aria-label="show 17 new notifications"
        color="inherit"
        onClick={handleClick}
      >
        <Badge badgeContent={nbNotifs} color="error">
          <SvgIcon component={NotifIcon} inheritViewBox />
        </Badge>
      </IconButton>
      <Menu
        id="notif-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button' }}
        TransitionComponent={Collapse}
        sx={{ width: 320 }}
      >
        {content}
      </Menu>
    </>
  );
}
