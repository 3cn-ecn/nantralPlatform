import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Container } from '@mui/system';
import { CircularProgress, List, ListItem } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Avatar from '../Avatar/Avatar';
import { EventProps } from '../../Props/Event';

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
        console.log(error);
        setParticipantsStatus('error');
      });
  }
  const navigate = useNavigate();
  const listOfParticipants =
    participantsStatus === 'success' ? (
      <List>
        {participants.map((participant) => {
          return (
            <ListItem
              key={participant.id}
              component={NavLink}
              to={participant.url}
              sx={{
                color: 'text.primary',
                paddingTop: '0',
                paddingBottom: '0',
                margin: '1rem 0',
              }}
              onClick={() => {
                navigate(participant.url);
              }}
            >
              <Avatar title={participant.name} url={participant.picture} />
              <div style={{ marginLeft: '1rem' }}>{participant.name}</div>
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
        {t('event.participantsList')}
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
