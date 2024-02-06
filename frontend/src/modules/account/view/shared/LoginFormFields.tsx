import { useCallback } from 'react';

import { TextField } from '#shared/components/FormFields';
import { PasswordField } from '#shared/components/FormFields/PasswordField';

interface LoginFormFieldsProps {
  isError;
  error;
  formValues;
  updateFormValues;
  prevData;
}

export function LoginFormFields({
  error,
  formValues,
  updateFormValues,
}: LoginFormFieldsProps) {
  // const { t } = useTranslation();

  return (
    <>
      <TextField
        name="email"
        label={'Email'}
        type="email"
        value={formValues.email}
        handleChange={useCallback(
          (val) => updateFormValues({ email: val }),
          [updateFormValues],
        )}
        errors={error?.fields?.email}
        required
        helperText="Your email address ec-nantes.fr"
        sx={{ marginBottom: 2 }}
      />
      <PasswordField
        handleChange={useCallback(
          (val) => updateFormValues({ password: val }),
          [updateFormValues],
        )}
        label="Password"
        required
      />
    </>
  );
}
