import React from 'react';

import { Close } from '@mui/icons-material';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';

export function ImageModal(props: {
  url: string;
  onClose: () => void;
  open: boolean;
}) {
  const { url, onClose, open } = props;
  const theme = useTheme();
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
