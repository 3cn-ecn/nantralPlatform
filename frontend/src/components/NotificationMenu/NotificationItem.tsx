/* eslint-disable react/prop-types */
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
import axios from '../../legacy/utils/axios';
import formatUrl from '../../legacy/utils/formatUrl';
import './NotificationItem.scss';

const app = '/api/notification/';
const REGISTER_URL = `${app}register`;
const SUBSCRIPTION_URL = `${app}subscription/{0}`;
const GET_NOTIFICATIONS_URL = `${app}get_notifications`;
const MANAGE_NOTIFICATION_URL = `${app}notification/{0}`;

function NotificationItem(props) {
  const { sn } = props;
  const n = sn.notification;

  async function updateSeen(event: React.MouseEvent<HTMLLinkElement>) {
    // update the seen property
    event.stopPropagation();
    const previous = sn.seen;
    sn.seen = null;
    setNotifOnLoad(true);
    const url = formatUrl(MANAGE_NOTIFICATION_URL, [n.id]);
    axios
      .post(url, {})
      .then((resp) => {
        // mettre à jour la liste des notifs
        sn.seen = resp.data;
        // mettre à jour le compteur
        if (resp.data) {
          setNbNotifs(nbNotifs - 1);
        } else {
          setNbNotifs(nbNotifs + 1);
        }
        setNotifOnLoad(false);
      })
      .catch((err) => {
        sn.seen = previous;
      });
    return true;
  }

  const openItem = () => {
    // update the seen property
    setNotifOnLoad(true);
    sn.seen = null;
    if (sn.seen) {
      window.open(n.url, '_self');
    } else {
      const url = formatUrl(MANAGE_NOTIFICATION_URL, [n.id]);
      axios.post(url, {}).finally(() => window.open(n.url, '_self'));
    }
  };

  return (
    <MenuItem
      component={Link}
      to={n.url}
      className="menuItem"
      disablePadding
      onClick={() => updateSeen}
    >
      <li className={sn.seen ? '' : 'bg-light'}>
        <span className="spanno" style={{ alignItems: 'center' }}>
          {n.icon_url ? (
            <img src={n.icon_url} alt="Icon de l'évènement" loading="lazy" />
          ) : (
            <SvgIcon sx={{ mr: 2 }} component={NantralIcon} inheritViewBox />
          )}
          <small className="notif">
            {n.title}
            <br />
            <Box
              component="div"
              whiteSpace="normal"
              sx={{ typography: 'subtitle2' }}
            >
              {n.body}
            </Box>
          </small>
        </span>
        <span className={`text-${sn.seen ? 'light' : 'danger'} read-button`}>
          {sn.seen != null ? '●' : ''}
        </span>
      </li>
    </MenuItem>
  );
}

export { NotificationItem };
