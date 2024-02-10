import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Divider } from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { passwordResetApi } from '#modules/account/api/passwordReset.api';
import { PasswordField } from '#shared/components/FormFields/PasswordField';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';

export default function ResetPasswordForm() {
  const { token = undefined } = useParams();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    password: '',
    confirmPassword: '',
  });

  const { error, isLoading, mutate } = useMutation<
    number,
    {
      fields?: { password?: string[]; confirmPassword?: string[] };
      globalErrors?: string[];
    },
    { password: string; confirmPassword: string }
  >(resetPassword, { onSuccess: () => navigate('success') });

  function resetPassword(form: { password: string; confirmPassword: string }) {
    if (!!form?.password && form?.password !== form?.confirmPassword) {
      throw { fields: { confirmPassword: ["Passwords don't match."] } };
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
        label="New password"
        helperText={'Your new password must contain at least 7 characters.'}
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
        label="Confirm new password"
        errors={error?.fields?.confirmPassword}
        required
      />
      <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
      <LoadingButton
        loading={isLoading}
        size="large"
        fullWidth
        variant="contained"
        type="submit"
      >
        Update password
      </LoadingButton>
    </form>
  );
}
