import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { CapitalizeFirstLetter } from '../../utils/formatText';
import { EventProps } from '../../Props/Event';

export function EventParticipantsModal(props: {
  open: boolean;
  event: EventProps;
  onClose: () => void;
}) {
  const { open, event, onClose } = props;
  const { t } = useTranslation('translation'); // translation module
  const [participants, setParticipants] = useState([]);
  const [participantsStatus, setOpenModal] = useState('loading');

  useEffect(() => {
    if (open) {
      getStudents();
    }
  }, [open]);

  async function getStudents() {
    await axios
      .get(`/api/event/${event.id}/participants`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <Dialog open={open} aria-labelledby="responsive-dialog-title">
      <DialogTitle id="responsive-dialog-title">
        {t('event.participantsList')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText></DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()} autoFocus variant="contained">
          {t('button.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
