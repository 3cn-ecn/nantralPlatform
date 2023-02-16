import * as React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  Modal,
} from '@mui/material';
import './ButtonBanner.scss';

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
              Semaine du {startDate.toDateString()} au {endDate.toDateString()}
            </h2>
            <img alt="" src={imageUri} id="image" />
          </div>
        </div>
      </Modal>
    </>
  );
}
