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

import { deleteItemApi } from '#modules/nantralpay/api/deleteItem.api';
import { ItemPreview } from '#modules/nantralpay/types/item.type';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { useTranslation } from '#shared/i18n/useTranslation';

/** A modal to confirm the deletion of a member. */
export function ModalDeleteItem({
  onClose,
  item,
  open,
}: {
  onClose: (deleted: boolean) => void;
  open: boolean;
  item: ItemPreview;
}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate, isLoading, error } = useMutation({
    mutationFn: deleteItemApi,
    mutationKey: ['members', 'delete'],
    onSuccess: () => {
      queryClient.invalidateQueries(['items']);
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
          Voulez vous vraiment supprimer l&#39;article {item.name} ?
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
          onClick={() => mutate(item.id)}
          variant="contained"
          loading={isLoading}
        >
          {t('button.delete')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
