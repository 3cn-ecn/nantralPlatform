import { useState } from 'react';

import { StarOutline } from '@mui/icons-material';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { changeMainEmailApi } from '#modules/account/api/changeMainEmail.api';
import { Email } from '#modules/account/email.type';
import { ChangeMainEmailModal } from '#modules/account/view/Email/ChangeMainEmailModal';
import { useToast } from '#shared/context/Toast.context';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

export function SetMainMenuItem({
  email,
  handleClose,
  studentId,
}: {
  email: Email;
  handleClose: () => void;
  studentId: number;
}) {
  const showToast = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [mainModalOpen, setMainModalOpen] = useState(false);
  const changeEmailMutation = useMutation<
    string,
    ApiFormError<{ email: string; password: string }>,
    { email: string; password: string }
  >({
    mutationFn: ({ email, password }) =>
      changeMainEmailApi(email, password, studentId),
    onSuccess: async (message) => {
      showToast({
        message: message,
        variant: 'success',
      });
      await queryClient.invalidateQueries(['emails']);
    },
    onError: (error) => {
      if (error.fields?.email) {
        showToast({
          message:
            "Erreur sur l'adresse sélectionnée : " +
            error.fields.email.join(', '),
          variant: 'error',
        });
      } else {
        showToast({
          variant: 'error',
          message: t('email.setMain.error'),
        });
      }
    },
    onSettled: () => {
      changeEmailMutation.reset();
      setMainModalOpen(false);
      handleClose();
    },
  });
  return (
    <>
      <MenuItem
        onClick={() => {
          setMainModalOpen(true);
        }}
      >
        <ListItemIcon>
          <StarOutline />
        </ListItemIcon>
        <ListItemText>{t('email.setMain.label')}</ListItemText>
      </MenuItem>
      {mainModalOpen && (
        <ChangeMainEmailModal
          email={email}
          mutate={changeEmailMutation.mutate}
          onCancel={() => {
            setMainModalOpen(false);
            changeEmailMutation.reset();
            handleClose();
          }}
          reset={changeEmailMutation.reset}
          isLoading={changeEmailMutation.isLoading}
        />
      )}
    </>
  );
}
