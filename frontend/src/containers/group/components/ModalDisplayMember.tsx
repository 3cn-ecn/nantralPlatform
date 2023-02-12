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
} from '@mui/material';
import {
  Close as CloseIcon,
  OpenInNew as OpenInNewIcon,
  Edit as EditIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';
import Avatar from './Avatar';
import { Membership, Group, Student } from '../interfaces';

function ShowMemberModal(props: {
  closeModal: () => void;
  openEditModal?: () => void;
  open: boolean;
  member: Membership;
  group?: Group,
  student: Student
}) {
  const { closeModal, openEditModal, open, member, group, student } = props;

  return (
    <Dialog
      aria-labelledby="customized-dialog-title"
      open={open}
      onClose={closeModal}
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            url={group ? member.student.picture : member.group.icon }
            title={group ? member.student.full_name : member.group.name }
            size='large'
          />
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {group ? member.student.full_name : member.group.name }
              </Typography>
              { member.admin ? <VerifiedIcon color='secondary' /> : <></> }
            </Box>
            <Typography variant="subtitle1">
              {member.summary}
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={closeModal}
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
          hidden={group && group.group_type.is_year_group}
          color='text.secondary'
          gutterBottom
          sx={{ fontSize: 12, fontStyle: 'italic' }}
        >
          Membre du {new Date(member.begin_date).toLocaleDateString()
          } au {new Date(member.end_date).toLocaleDateString()}
        </Typography>
        <Typography gutterBottom>
          {member.description || `Membre de ${member.group.name}`}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          href={group ? member.student.url : member.group.url }
          variant='text'
          endIcon={<OpenInNewIcon />}
        >
          { group ? 'Ouvrir le profil' : 'Ouvrir le groupe' }
        </Button>
        <Button
          hidden={!openEditModal || !group?.is_admin && student.id !== member.student.id }
          onClick={openEditModal}
          variant='outlined'
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
