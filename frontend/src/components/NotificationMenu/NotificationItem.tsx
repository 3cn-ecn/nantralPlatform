/* eslint-disable react/prop-types */
import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Typography,
  Box,
  ListItem,
  Card,
  IconButton,
  CardActionArea,
} from '@mui/material';
import axios from 'axios';
import './NotificationItem.scss';
import Avatar from '../Avatar/Avatar';

const app = '/api/notification/';
const MANAGE_NOTIFICATION_URL = `${app}notification/`;

function NotificationItem(props) {
  const { sn, nbNotifs, setNbNotifs } = props;
  const n = sn.notification;

  async function updateSeen() {
    // update the seen property
    const previous = sn.seen;
    sn.seen = null;
    const url = `${MANAGE_NOTIFICATION_URL}${[n.id]}`;
    // mettre à jour la liste des notifs
    if (!previous) {
      const response = await axios.post(url, { seen: true });
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
    <ListItem sx={{ height: 80 }}>
      <Card className="spanno">
        <CardActionArea
          component={Link}
          to={n.url}
          onClick={() => updateSeen()}
          sx={{
            display: 'flex',
            justifyContent: 'left',
            gap: 1,
            padding: 1,
            height: '100%',
            width: '100%',
          }}
        >
          <Avatar title={n.title} url={n.icon_url} size="medium" />
          <small className="notif">
            {n.title}
            <Box
              component="div"
              whiteSpace="normal"
              sx={{ typography: 'subtitle2', lineHeight: 1, marginTop: 0.5 }}
              className="notification-body"
            >
              {n.body}
            </Box>
          </small>
        </CardActionArea>
        {!sn.seen && (
          <IconButton
            onClick={() => updateSeen()}
            sx={{ zindex: 20, position: 'absolute', right: 0, marginRight: 3 }}
          >
            <Typography color="primary" component="span">
              ●
            </Typography>
          </IconButton>
        )}
      </Card>
      <Box component="span"></Box>
    </ListItem>
  );
}

export { NotificationItem };
