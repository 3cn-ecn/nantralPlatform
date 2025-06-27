import { useCallback } from 'react';

import { TextField } from '#shared/components/FormFields';
import { useTranslation } from '#shared/i18n/useTranslation';

interface UpdateUsernameFormFieldsProps {
  isError;
  error;
  formValues;
  updateFormValues;
  prevData;
}

export function UpdateUsernameFormFields({
  error,
  formValues,
  updateFormValues,
}: UpdateUsernameFormFieldsProps) {
  const { t } = useTranslation();

  return (
    <>
      <TextField
        name="username"
        label={t('register.username')}
        type="text"
        value={formValues.username}
        handleChange={useCallback(
          (val) => updateFormValues({ username: val }),
          [updateFormValues],
        )}
        errors={error?.fields?.username}
        helperText={t('register.usernameHelp')}
        required
        sx={{ marginBottom: 2 }}
      />
    </>
  );
}
