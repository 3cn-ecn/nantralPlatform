import { useCallback } from 'react';

import { TextField } from '#shared/components/FormFields';
import { PasswordField } from '#shared/components/FormFields/PasswordField';
import { useTranslation } from '#shared/i18n/useTranslation';

interface LoginFormFieldsProps {
  isError;
  error;
  formValues;
  updateFormValues;
  prevData;
  askEcnEmail: boolean;
}

export function LoginFormFields({
  error,
  formValues,
  updateFormValues,
  askEcnEmail,
}: LoginFormFieldsProps) {
  const { t } = useTranslation();

  return (
    <>
      <TextField
        name="email"
        label={t('login.email')}
        type="email"
        value={formValues.email}
        handleChange={useCallback(
          (val) => updateFormValues({ email: val }),
          [updateFormValues],
        )}
        errors={error?.fields?.email}
        required
        sx={{ marginBottom: 2 }}
      />
      {askEcnEmail && (
        <TextField
          name="ecnEmail"
          label={t('register.ECNEmail')}
          type="email"
          value={formValues.email_ecn}
          handleChange={(val) => updateFormValues({ email_ecn: val })}
          errors={error?.fields?.email_ecn}
          sx={{ marginBottom: 2 }}
        />
      )}
      <PasswordField
        handleChange={useCallback(
          (val) => updateFormValues({ password: val }),
          [updateFormValues],
        )}
        label={t('login.password')}
        required
      />
    </>
  );
}
