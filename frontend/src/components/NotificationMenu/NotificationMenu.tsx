import * as React from 'react';
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

let checkNotif = 0;

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
  const [nbNotifs, setNbNotifs] = React.useState<number>(null);
  const [listNotifs, setListNotifs] = React.useState<SentNotification[]>([]);
  const [subscribeFilter, setSubscribeFilter] = React.useState<boolean>(false);
  const [unseenFilter, setUnseenFilter] = React.useState<boolean>(false);
  const [allLoaded, setAllLoaded] = React.useState<boolean>(false);
  const step = 5;
  const app = '/api/notification/';
  const GET_NOTIFICATIONS_URL = `${app}get_notifications`;
  const { t } = useTranslation('translation');

  if (nbNotifs === null) {
    getNbNotifs();
  }

  async function getNbNotifs(): Promise<void> {
    const urlf = formatUrl(GET_NOTIFICATIONS_URL, [], { mode: 1 });
    fetch(urlf)
      .then((resp) => resp.json().then((data) => setNbNotifs(data)))
      .catch((err) => setNbNotifs(null));
  }

  async function getListNotifs(): Promise<void> {
    const start = listNotifs.length;
    const queryParams = {
      mode: 2,
      start: start,
      nb: step,
    };
    const params = new URLSearchParams(queryParams);
    const urlf = `/api/notification/get_notifications?${params}`;
    axios.get(urlf).then((res) => {
      if (listNotifs.length === checkNotif) {
        const merging = merge(listNotifs, res.data);
        setListNotifs(merging);
        if (merging.length < start + step) setAllLoaded(true);
      }
    });
  }

  let content;
  const listToShow = listNotifs.filter((sn: SentNotification) => {
    let res = true;
    if (unseenFilter) res = res && !sn.seen;
    if (subscribeFilter) res = res && sn.suscribed;
    return res;
  });
  if (listToShow.length === 0) {
    content = (
      <MenuItem>
        <ListItem>
          <Typography sx={{ width: 278 }}>Aucune Notification 😢</Typography>
        </ListItem>
      </MenuItem>
    );
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
  let contentMore;
  if (!allLoaded) {
    contentMore = (
      <ListItem>
        <Box sx={{ flexGrow: 0.5 }} />
        <Button
          size="small"
          onClick={() => {
            checkNotif += step;
            getListNotifs();
          }}
        >
          {t('notif.load')}
        </Button>
        <Box sx={{ flexGrow: 0.5 }} />
      </ListItem>
    );
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
        PaperProps={{
          style: {
            maxHeight: 600,
          },
        }}
      >
        <ListItem>
          <Typography className="menuTitle" variant="h6">
            {t('notif.title')}
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
            variant={!subscribeFilter ? 'outlined' : 'contained'}
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
            {t('notif.subscribed')}
          </Button>
          <Button
            variant={!unseenFilter ? 'outlined' : 'contained'}
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
            {t('notif.unread')}
          </Button>
        </ListItem>
        {content}
        {contentMore}
      </Menu>
    </>
  );
}
