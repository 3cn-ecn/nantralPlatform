import { useState } from 'react';

import { StarOutline } from '@mui/icons-material';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { changeMainEmailApi } from '#modules/account/api/changeMainEmail.api';
import { Email } from '#modules/account/email.type';
import { EmailDTO } from '#modules/account/infra/email.dto';
import { ChangeMainEmailModal } from '#modules/account/view/Email/ChangeMainEmailModal';
import { useToast } from '#shared/context/Toast.context';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

export function SetMainMenuItem({
  email,
  handleClose,
}: {
  email: Email;
  handleClose: () => void;
}) {
  const showToast = useToast();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [mainModalOpen, setMainModalOpen] = useState(false);
  const changeEmailMutation = useMutation<
    EmailDTO,
    ApiFormError<{ password: string }>,
    { password: string }
  >({
    mutationFn: ({ password }) => changeMainEmailApi(email.uuid, password),
    onSuccess: async () => {
      showToast({
        message: t('email.setMain.success'),
        variant: 'success',
      });
      await queryClient.invalidateQueries(['emails']);
    },
    onError: (error) => {
      if (error.globalErrors) {
        showToast({
          message: error.globalErrors.join(', '),
          variant: 'error',
        });
      }
      if (error.message) {
        showToast({
          message: error.message,
          variant: 'error',
        });
      }
      if (!error.globalErrors && !error.message) {
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
