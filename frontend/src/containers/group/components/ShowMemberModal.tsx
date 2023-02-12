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
  Close as CloseIcon,
  OpenInNew as OpenInNewIcon,
  Edit as EditIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';
import Avatar from './Avatar';
import { Membership, Group } from '../interfaces';

function ShowMemberModal(props: { onClose: () => void; onEdit: () => void; open: boolean; member: Membership; group: Group}) {
  const { onClose, onEdit, open, member, group } = props;

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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {member.student.full_name}
              </Typography>
              { member.admin ? <VerifiedIcon color='secondary' /> : <></> }
            </Box>
            <Typography variant="subtitle1">
              {member.summary}
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              marginLeft: 'auto',
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Typography
          hidden={group.group_type.is_year_group}
          color='text.secondary'
          gutterBottom
          sx={{ fontSize: 12, fontStyle: 'italic' }}
        >
          Membre du {new Date(member.begin_date).toLocaleDateString()
          } au {new Date(member.end_date).toLocaleDateString()}
        </Typography>
        <Typography gutterBottom>
          {member.description || `Membre de ${group.name}`}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          href={member.student.url}
          variant='outlined'
          endIcon={<OpenInNewIcon />}
        >
          Ouvrir le profil
        </Button>
        <Button
          onClick={onEdit}
          variant='contained'
          endIcon={<EditIcon />}
          sx={{ marginLeft: 1 }}
        >
          Modifier
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ShowMemberModal;
