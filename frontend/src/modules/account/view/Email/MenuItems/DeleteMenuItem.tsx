import { useState } from 'react';

import { DeleteForever } from '@mui/icons-material';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { removeEmailApi } from '#modules/account/api/removeEmail.api';
import { Email } from '#modules/account/email.type';
import { ConfirmationModal } from '#shared/components/Modal/ConfirmationModal';
import { useToast } from '#shared/context/Toast.context';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiError } from '#shared/infra/errors';

export function DeleteMenuItem({
  email,
  handleClose,
}: {
  email: Email;
  handleClose: () => void;
}) {
  const showToast = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const deleteEmailMutation = useMutation<number, ApiError, string>({
    mutationFn: removeEmailApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['emails'],
      });
      showToast({
        variant: 'success',
        message: t('email.delete.success'),
      });
    },
    onError: () =>
      showToast({
        variant: 'error',
        message: t('email.delete.error'),
      }),
    onSettled: () => {
      setDeleteModalOpen(false);
      handleClose();
    },
  });

  return (
    <>
      <MenuItem
        onClick={() => {
          setDeleteModalOpen(true);
        }}
      >
        <ListItemIcon>
          <DeleteForever />
        </ListItemIcon>
        <ListItemText>{t('button.delete')}</ListItemText>
      </MenuItem>
      {deleteModalOpen && (
        <ConfirmationModal
          title={t('email.deleteModal.title')}
          body={t('email.deleteModal.body', { email: email.email })}
          onCancel={() => {
            setDeleteModalOpen(false);
            handleClose();
          }}
          onConfirm={() => deleteEmailMutation.mutate(email?.uuid)}
          loading={deleteEmailMutation.isPending}
        />
      )}
    </>
  );
}
