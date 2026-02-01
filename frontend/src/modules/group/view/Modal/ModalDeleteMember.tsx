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
import { ApiError } from '#shared/infra/errors';

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
  const { mutate, isPending, error } = useMutation<number, ApiError, number>({
    mutationFn: deleteMembershipApi,
    mutationKey: ['members', 'delete'],
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['members', { slug: member.group.slug }],
      });
      queryClient.invalidateQueries({
        queryKey: [
          'membership',
          { group: member.group.slug, student: member.student.id },
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ['group', { slug: member.group.slug }],
      });
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
            {error.message}
          </Alert>
        )}
        <DialogContentText>
          {t('group.details.modal.deleteMember.text', {
            student: member.student.name,
            group: member.group.name,
          })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => onClose(false)}
          variant="text"
          disabled={isPending}
        >
          {t('button.cancel')}
        </Button>
        <LoadingButton
          onClick={() => mutate(member.id)}
          variant="contained"
          loading={isPending}
        >
          {t('button.delete')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
