/* eslint-disable react/prop-types */
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Box, MenuItem } from '@mui/material';
import SvgIcon from '@mui/material/SvgIcon';
import { ReactComponent as NantralIcon } from '../../assets/logo/scalable/logo.svg';
import axios from '../../legacy/utils/axios';
import formatUrl from '../../legacy/utils/formatUrl';
import './NotificationItem.scss';

const app = '/api/notification/';
const MANAGE_NOTIFICATION_URL = `${app}notification/{0}`;

function NotificationItem(props) {
  const { sn, nbNotifs, setNbNotifs } = props;
  const n = sn.notification;

  async function updateSeen() {
    // update the seen property
    const previous = sn.seen;
    sn.seen = null;
    const url = formatUrl(MANAGE_NOTIFICATION_URL, [n.id]);
    const response = await axios.post(url, { seen: true });
    // mettre à jour la liste des notifs
    if (!previous) {
      sn.seen = response.data;
      // mettre à jour le compteur
      if (response.data) {
        setNbNotifs(nbNotifs - 1);
      } else {
        setNbNotifs(nbNotifs + 1);
      }
    } else {
      sn.seen = previous;
    }

    return true;
  }

  return (
    <MenuItem
      component={Link}
      to={n.url}
      className="menuItem"
      onClick={() => {
        updateSeen();
      }}
    >
      <li className={sn.seen ? '' : 'bg-light'}>
        <span className="spanno">
          {n.icon_url ? (
            <img src={n.icon_url} alt="Icon de l'évènement" />
          ) : (
            <SvgIcon sx={[{ mr: 2 }]} component={NantralIcon} inheritViewBox />
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
        <Box component="span">
          <Typography color="primary" component="span">
            {sn.seen !== true ? '●' : ''}
          </Typography>
        </Box>
      </li>
    </MenuItem>
  );
}

export { NotificationItem };
