import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteMembershipApi } from '#modules/group/api/deleteMembership.api';
import { Membership } from '#modules/group/types/membership.types';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { useTranslation } from '#shared/i18n/useTranslation';

/** A modal to confirm the deletion of a member. */
export function ModalDeleteMember({
  onClose,
  member,
  open,
}: {
  onClose: (deleted: boolean) => void;
  open: boolean;
  member: Membership;
}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate, isLoading, error } = useMutation({
    mutationFn: deleteMembershipApi,
    mutationKey: ['members', 'delete'],
    onSuccess: () => {
      queryClient.invalidateQueries(['members', { slug: member.group.slug }]);
      queryClient.invalidateQueries([
        'membership',
        { group: member.group.slug, user: member.user.id },
      ]);
      queryClient.invalidateQueries(['group', { slug: member.group.slug }]);
      onClose(true);
    },
  });

  return (
    <Dialog
      aria-labelledby="customized-dialog-title"
      open={open}
      onClose={onClose}
    >
      <DialogTitle>{t('group.details.modal.deleteMember.title')}</DialogTitle>
      <DialogContent>
        {!!error && (
          <Alert severity="error" sx={{ mb: 1 }}>
            {error as string}
          </Alert>
        )}
        <DialogContentText>
          {t('group.details.modal.deleteMember.text', {
            user: member.user.name,
            group: member.group.name,
          })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => onClose(false)}
          variant="text"
          disabled={isLoading}
        >
          {t('button.cancel')}
        </Button>
        <LoadingButton
          onClick={() => mutate(member.id)}
          variant="contained"
          loading={isLoading}
        >
          {t('button.delete')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
