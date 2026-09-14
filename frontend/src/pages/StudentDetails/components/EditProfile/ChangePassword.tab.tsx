import { FormEvent, useState } from 'react';

import { Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { changePasswordApi } from '#modules/account/api/changePassword.api';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { useToast } from '#shared/context/Toast.context';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

import { ChangePasswordFormFields } from '../FormFields/ChangePasswordFormFields';

export interface ChangePasswordForm {
  newPassword: string;
  oldPassword: string;
  confirmNewPassword: string;
}

export function ChangePasswordTab() {
  const { t } = useTranslation();
  const today = new Date();
  const oneYear = new Date();
  oneYear.setFullYear(today.getFullYear() + 1);
  const [formValues, setFormValues] = useState<ChangePasswordForm>({
    newPassword: '',
    oldPassword: '',
    confirmNewPassword: '',
  });

  const { error, isError, mutate, isPending } = useMutation<
    number,
    ApiFormError<{
      old_password: string;
      new_password: string;
      confirm_new_password: string;
    }>,
    ChangePasswordForm
  >({
    mutationFn: changePasswordApi,
    onSuccess: () => {
      showToast({
        message: 'Password successfully modified',
        variant: 'success',
        autoHideDuration: 5000,
      });
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
    <>
      <Typography variant="h2">{t('student.details.editPassword')}</Typography>
      <form id="edit-password-form" onSubmit={(e) => onSubmit(e)}>
        <ChangePasswordFormFields
          error={error}
          isError={isError}
          formValues={formValues}
          updateFormValues={updateFormValues}
        />
      </form>

      <LoadingButton
        form="edit-password-form"
        type="submit"
        loading={isPending}
        variant="contained"
      >
        {t('button.confirm')}
      </LoadingButton>
    </>
  );
}
