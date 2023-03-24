import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  useMediaQuery,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import React from 'react';
import { theme } from '../style/palette';

export function ImageModal(props: {
  url: string;
  onClose: () => void;
  open: boolean;
}) {
  const { url, onClose, open } = props;
  const fullScreen: boolean = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      fullScreen={fullScreen}
      PaperProps={{ sx: { minWidth: '90%' } }}
      sx={{ margin: 0 }}
    >
      <DialogTitle>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent dividers>
        <img alt="" src={url} style={{ width: '100%' }} />
      </DialogContent>
    </Dialog>
  );
}
