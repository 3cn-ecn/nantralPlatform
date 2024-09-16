import { FormEvent, useState } from 'react';

import { Password } from '@mui/icons-material';
import { Avatar, Button, useTheme } from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { changePasswordApi } from '#modules/account/api/changePassword.api';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
} from '#shared/components/ResponsiveDialog';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useToast } from '#shared/context/Toast.context';
import { useTranslation } from '#shared/i18n/useTranslation';

import { ChangePasswordFormFields } from './FormFields/ChangePasswordFormFields';

export interface ChangePasswordForm {
  newPassword: string;
  oldPassword: string;
  confirmNewPassword: string;
}

export function ModalChangePassword({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const today = new Date();
  const oneYear = new Date();
  oneYear.setFullYear(today.getFullYear() + 1);
  const [formValues, setFormValues] = useState<ChangePasswordForm>({
    newPassword: '',
    oldPassword: '',
    confirmNewPassword: '',
  });

  const { palette } = useTheme();
  const { error, isError, mutate, isLoading } = useMutation(changePasswordApi, {
    onSuccess: () => {
      showToast({
        message: 'Password successfully modified',
        variant: 'success',
        autoHideDuration: 5000,
      });
      onClose();
    },
  });
  const showToast = useToast();

  function updateFormValues(val: Partial<ChangePasswordForm>) {
    setFormValues({ ...formValues, ...val });
  }
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate(formValues);
  }

  return (
    <ResponsiveDialog onClose={onClose} disableEnforceFocus maxWidth="sm">
      <ResponsiveDialogHeader
        onClose={onClose}
        leftIcon={
          <Avatar sx={{ bgcolor: palette.primary.main }}>
            <Password />
          </Avatar>
        }
      >
        {t('student.details.changePassword')}
        <Spacer flex={1} />
      </ResponsiveDialogHeader>
      <ResponsiveDialogContent>
        <form id="edit-password-form" onSubmit={(e) => onSubmit(e)}>
          <ChangePasswordFormFields
            error={error}
            isError={isError}
            formValues={formValues}
            updateFormValues={updateFormValues}
          />
        </form>
      </ResponsiveDialogContent>
      <ResponsiveDialogFooter>
        <Button variant="text" onClick={() => onClose()}>
          {t('button.cancel')}
        </Button>
        <LoadingButton
          form="edit-password-form"
          type="submit"
          loading={isLoading}
          variant="contained"
        >
          {t('button.confirm')}
        </LoadingButton>
      </ResponsiveDialogFooter>
    </ResponsiveDialog>
  );
}
