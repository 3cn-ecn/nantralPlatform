import React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import {
  Card,
  CardActionArea,
  CircularProgress,
  List,
  ListItem,
} from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Container } from '@mui/system';
import axios from 'axios';

import { EventProps } from '#types/Event';

import Avatar from '../Avatar/Avatar';

export function EventParticipantsModal(props: {
  open: boolean;
  event: EventProps;
  onClose: () => void;
}) {
  const { open, event, onClose } = props;
  const { t } = useTranslation('translation'); // translation module
  const [participants, setParticipants] = useState([]);
  const [participantsStatus, setParticipantsStatus] = useState('loading');

  useEffect(() => {
    if (open) {
      getStudents();
    }
  }, [open]);

  async function getStudents() {
    await axios
      .get(`/api/event/${event.id}/participants`)
      .then((response) => {
        setParticipants(response.data);
        setParticipantsStatus('success');
      })
      .catch((error) => {
        console.error(error);
        setParticipantsStatus('error');
      });
  }
  const listOfParticipants =
    participantsStatus === 'success' ? (
      <List>
        {participants.map((participant) => {
          return (
            <ListItem
              key={participant.id}
              sx={{
                color: 'text.primary',
                padding: 0,
                margin: '1rem 0',
              }}
            >
              <Card
                sx={{
                  width: '100%',
                  justifyContent: 'space-between',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                <CardActionArea
                  sx={{ width: '100%', padding: 1, paddingRight: 4 }}
                  component={NavLink}
                  to={participant.url}
                >
                  <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <Avatar
                      title={participant.name}
                      url={participant.picture}
                    />
                    <div style={{ marginLeft: '1rem' }}>{participant.name}</div>
                  </div>
                </CardActionArea>
                {/* TO DO LATER Remove participant option */}
                {/* <IconButton sx={{ position: 'absolute', right: 0 }}>
                  <Delete color="error" />
                </IconButton> */}
              </Card>
            </ListItem>
          );
        })}
      </List>
    ) : (
      <div style={{ display: 'flex', height: '100%' }}>
        <Container className="loading" sx={{ display: 'flex' }}>
          <CircularProgress color="primary" />
        </Container>
      </div>
    );

  return (
    <Dialog
      open={open}
      aria-labelledby="responsive-dialog-title"
      onClose={() => onClose()}
    >
      <DialogTitle id="responsive-dialog-title">
        {`${t('event.participantsList')} (${event.numberOfParticipants}`}
        {event.maxParticipant ? `/${event.maxParticipant})` : ')'}
      </DialogTitle>
      <DialogContent>{listOfParticipants}</DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()} autoFocus variant="contained">
          {t('button.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
