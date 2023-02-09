import * as React from 'react';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import {
  IconButton,
  Typography,
  Box,
  Badge,
  Menu,
  MenuItem,
  ListItem,
  Button,
} from '@mui/material';
import SvgIcon from '@mui/material/SvgIcon';
import Collapse from '@mui/material/Collapse';
import SettingsIcon from '@mui/icons-material/Settings';
import { ReactComponent as NotifIcon } from '../../assets/scalable/notification.svg';
import { NotificationItem } from './NotificationItem';
import axios from '../../legacy/utils/axios';
import formatUrl from '../../legacy/utils/formatUrl';
import merge from '../../legacy/notification/utils';
import './NotificationItem.scss';

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
    if (listNotifs.length === 0) {
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
    let res = true;
    if (unseenFilter) res = res && !sn.seen;
    if (subscribeFilter) res = res && sn.suscribed;
    return res;
  });
  if (listToShow.length === 0) {
    if (onLoad) {
      content = (
        <MenuItem>
          <ListItem>
            <Typography sx={{ width: 278 }}>Aucune Notification 😢</Typography>
          </ListItem>
        </MenuItem>
      );
    }
  } else {
    content = listToShow.map((sn) => (
      <NotificationItem
        key={sn.notification.id}
        sn={sn}
        nbNotifs={nbNotifs}
        setNbNotifs={setNbNotifs}
      />
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
      >
        <ListItem disableRipple="true">
          <Typography className="menuTitle" variant="h6">
            Notifications
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            aria-label="show 17 new notifications"
            color="inherit"
            onClick={handleClose}
          >
            <SvgIcon component={SettingsIcon} inheritViewBox />
          </IconButton>
        </ListItem>
        <ListItem>
          <Button
            variant="outlined"
            size="small"
            sx={[
              { mr: 1 },
              {
                '&:hover': {
                  color: 'white',
                  backgroundColor: '#dc3545',
                },
              },
              {
                borderRadius: 4,
              },
            ]}
            onClick={() => setSubscribeFilter(!subscribeFilter)}
          >
            Abonné
          </Button>
          <Button
            variant="outlined"
            size="small"
            sx={[
              {
                '&:hover': {
                  color: 'white',
                  backgroundColor: '#dc3545',
                },
              },
              {
                borderRadius: 4,
              },
            ]}
            onClick={() => setUnseenFilter(!unseenFilter)}
          >
            Non Lu
          </Button>
        </ListItem>
        {content}
      </Menu>
    </>
  );
}
