import {
  Close as CloseIcon,
  Edit as EditIcon,
  OpenInNew as OpenInNewIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';

import { User } from '#modules/account/user.types';
import { Group } from '#modules/group/types/group.types';

import { Membership } from '../interfaces';
import Avatar from './Avatar';

function ShowMemberModal(props: {
  closeModal: () => void;
  openEditModal?: () => void;
  open: boolean;
  member: Membership;
  group?: Group;
  student: User;
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
            url={group ? member.user.picture : member.group.icon}
            title={group ? member.user.name : member.group.name}
            size="large"
          />
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {group ? member.user.name : member.group.name}
              </Typography>
              {member.admin ? <VerifiedIcon color="secondary" /> : <></>}
            </Box>
            <Typography variant="subtitle1">{member.summary}</Typography>
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
          hidden={group && group.groupType.noMembershipDates}
          color="text.secondary"
          gutterBottom
          sx={{ fontSize: 12, fontStyle: 'italic' }}
        >
          Membre du {new Date(member.begin_date).toLocaleDateString()} au{' '}
          {new Date(member.end_date).toLocaleDateString()}
        </Typography>
        <Typography gutterBottom>
          {member.description || `Membre de ${member.group.name}`}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          href={group ? member.user.url : member.group.url}
          variant="text"
          color="secondary"
          endIcon={<OpenInNewIcon />}
        >
          {group ? 'Ouvrir le profil' : 'Ouvrir le groupe'}
        </Button>
        <Button
          hidden={
            !openEditModal || (!group?.isAdmin && student.id !== member.user.id)
          }
          onClick={openEditModal}
          variant="outlined"
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
