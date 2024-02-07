import { useEffect, useState } from 'react';

import { Divider } from '@mui/material';

import { passwordResetApi } from '#modules/account/api/passwordReset.api';
import { BigButton } from '#shared/components/Button/BigButton';
import { PasswordField } from '#shared/components/FormFields/PasswordField';

export function ResetPasswordForm({
  token,
  onSuccess,
}: {
  token?: string;
  onSuccess: () => void;
}) {
  const [formValues, setFormValues] = useState({
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<{
    fields?: { password?: string[]; confirmPassword?: string[] };
    globalErrors?: string[];
  }>({ fields: {}, globalErrors: [] });

  async function updatePassword() {
    if (
      !!formValues?.password &&
      formValues?.password !== formValues?.confirmPassword
    ) {
      setError({ fields: { confirmPassword: ["Passwords don't match."] } });
      return;
    }
    if (!token) {
      setError({ globalErrors: ['Something went wrong'] });
      return;
    }

    const form = { password: formValues?.password, token: token };
    try {
      const status = await passwordResetApi(form);
      if (status === 200) onSuccess();
    } catch (err) {
      setError(err);
    }
  }
  useEffect(() => {
    setError({});
  }, [formValues]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        updatePassword();
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
        visibilityIcon={false}
        validatePassword={
          !!formValues?.confirmPassword &&
          formValues?.confirmPassword === formValues?.password
        }
        label="Confirm new password"
        errors={error?.fields?.confirmPassword}
        required
      />
      <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
      <BigButton type="submit">Update password</BigButton>
    </form>
  );
}
