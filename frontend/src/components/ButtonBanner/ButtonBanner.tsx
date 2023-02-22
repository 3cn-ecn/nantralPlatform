import * as React from 'react';
import { Button, Modal } from '@mui/material';
import './ButtonBanner.scss';
import { formatDate } from '../../utils/date';

export function ButtonBanner(props: { imageUri: string }) {
  const { imageUri } = props;
  const [open, setOpen] = React.useState<boolean>(false);

  const date = new Date();
  date.setDate(3);
  const startDate = new Date();
  const endDate = new Date();
  startDate.setDate(date.getDate() - date.getDay() + 1);
  endDate.setDate(date.getDate() - date.getDay() + 7);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        startIcon={<img style={{ height: '60px' }} alt="" src={imageUri} />}
        variant="outlined"
      >
        Calendrier du BDE
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div id="container">
          <div id="image-container">
            <h2 id="banner-title">
              Semaine du {formatDate(startDate, 'short')} au{' '}
              {formatDate(endDate, 'short')}
            </h2>
            <img alt="" src={imageUri} id="image" />
          </div>
        </div>
      </Modal>
    </>
  );
}
