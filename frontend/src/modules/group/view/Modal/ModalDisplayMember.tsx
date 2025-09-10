import { Link } from 'react-router-dom';

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

import { Group } from '#modules/group/types/group.types';
import { Membership } from '#modules/group/types/membership.types';
import { StudentPreview } from '#modules/student/student.types';
import { Avatar } from '#shared/components/Avatar/Avatar';
import { useTranslation } from '#shared/i18n/useTranslation';

export function ModalShowMember(props: {
  closeModal: () => void;
  openEditModal?: () => void;
  open: boolean;
  member: Membership;
  group?: Group;
  student: StudentPreview;
}) {
  const { closeModal, openEditModal, open, member, group, student } = props;
  const { t } = useTranslation();
  return (
    <Dialog
      aria-labelledby="customized-dialog-title"
      open={open}
      onClose={closeModal}
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            src={group ? member.student.picture : member.group.icon}
            alt={group ? member.student.name : member.group.name}
            size="l"
          />
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {group ? member.student.name : member.group.name}
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
          {t('group.details.modal.displayMember.dates', {
            from: member.beginDate.toLocaleDateString(),
            to: member.endDate.toLocaleDateString(),
          })}
        </Typography>
        <Typography gutterBottom>
          {member.description ||
            t('group.details.modal.displayMember.descripition', {
              group: member.group.name,
            })}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          component={Link}
          to={group ? member.student.url : member.group.url}
          variant="text"
          color="secondary"
          endIcon={<OpenInNewIcon />}
        >
          {group
            ? t('group.details.modal.displayMember.openProfile')
            : t('group.details.modal.displayMember.openGroup')}
        </Button>
        {group?.isAdmin && (
          <Button
            hidden={
              !openEditModal ||
              (!group?.isAdmin && student.id !== member.student.id)
            }
            onClick={openEditModal}
            variant="outlined"
            endIcon={<EditIcon />}
            sx={{ marginLeft: 1 }}
          >
            {t('button.edit')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
