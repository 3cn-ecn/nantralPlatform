import React from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon
} from '@mui/icons-material';
import Avatar from './avatar';
import { Membership } from '../interfaces';

function ShowMemberModal(props: { onClose: () => void; open: boolean; member: Membership}) {
  const { onClose, open, member } = props;
  return (
    <Dialog
      aria-labelledby="customized-dialog-title"
      open={open}
      onClose={onClose}
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar url={member.student.picture_url} title={member.student.full_name} size='large' />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {member.student.full_name}
            </Typography>
            <Typography variant="subtitle1">
              {member.summary}
            </Typography>
          </Box>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom color='disabled'>
          Membre du {member.begin_date.toLocaleDateString()} au {member.end_date.toLocaleDateString()}
        </Typography>
        <Typography gutterBottom>
          {member.description}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose}>
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ShowMemberModal;
