import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Divider } from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { passwordResetApi } from '#modules/account/api/passwordReset.api';
import { PasswordField } from '#shared/components/FormFields/PasswordField';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { useTranslation } from '#shared/i18n/useTranslation';

export default function ResetPasswordForm() {
  const { token = undefined } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState({
    password: '',
    confirmPassword: '',
  });

  const { error, isPending, mutate } = useMutation<
    number,
    {
      fields?: { password?: string[]; confirmPassword?: string[] };
      globalErrors?: string[];
    },
    { password: string; confirmPassword: string }
  >({ mutationFn: resetPassword, onSuccess: () => navigate('success') });

  function resetPassword(form: { password: string; confirmPassword: string }) {
    if (!!form?.password && form?.password !== form?.confirmPassword) {
      throw { fields: { confirmPassword: [t('register.passwordDontMatch')] } };
    }
    if (!token) {
      throw { globalErrors: ['Something went wrong'] };
    }

    return passwordResetApi({ password: form?.password, token: token });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutate(formValues);
      }}
    >
      <PasswordField
        handleChange={(val) => setFormValues({ ...formValues, password: val })}
        label={t('passwordReset.newPassword')}
        helperText={t('register.passwordHelperText')}
        errors={error?.fields?.password}
        required
      />
      <PasswordField
        sx={{ marginTop: 2 }}
        handleChange={(val) =>
          setFormValues({ ...formValues, confirmPassword: val })
        }
        visibilityIconHidden
        showValidateIcon={
          !!formValues?.confirmPassword &&
          formValues?.confirmPassword === formValues?.password
        }
        label={t('login.passwordConfirm')}
        errors={error?.fields?.confirmPassword}
        required
      />
      <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
      <LoadingButton
        loading={isPending}
        size="large"
        fullWidth
        variant="contained"
        type="submit"
      >
        {t('resetPassword.updatePassword')}
      </LoadingButton>
    </form>
  );
}
