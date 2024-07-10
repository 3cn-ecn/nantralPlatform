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
  const queryClient = useQueryClient();
  const { mutate, isLoading, error } = useMutation({
    mutationFn: deleteMembershipApi,
    mutationKey: ['members', 'delete'],
    onSuccess: () => {
      queryClient.invalidateQueries(['members', { slug: member.group.slug }]);
      queryClient.invalidateQueries([
        'membership',
        { group: member.group.slug, student: member.student.id },
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
      <DialogTitle>Supprimer le membre ?</DialogTitle>
      <DialogContent>
        {!!error && (
          <Alert severity="error" sx={{ mb: 1 }}>
            {error as string}
          </Alert>
        )}
        <DialogContentText>
          Voulez-vous vraiment supprimer {member.student.name} des membres de{' '}
          {member.group.name} ?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => onClose(false)}
          variant="text"
          disabled={isLoading}
        >
          Annuler
        </Button>
        <LoadingButton
          onClick={() => mutate(member.id)}
          variant="contained"
          loading={isLoading}
        >
          Supprimer
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
