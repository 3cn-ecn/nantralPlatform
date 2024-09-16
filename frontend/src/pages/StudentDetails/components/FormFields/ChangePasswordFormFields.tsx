import { PasswordField } from '#shared/components/FormFields/PasswordField';
import { ApiFormError } from '#shared/infra/errors';

import { ChangePasswordForm } from '../ChangePasswordModal';

export function ChangePasswordFormFields({
  formValues,
  error,
  updateFormValues,
}: {
  formValues: ChangePasswordForm;
  isError: boolean;
  error: ApiFormError<{
    old_password: string;
    new_password: string;
    confirm_new_password: string;
  }>;
  updateFormValues: (val: Partial<ChangePasswordForm>) => void;
}) {
  return (
    <>
      <PasswordField
        value={formValues.oldPassword}
        handleChange={(val) => updateFormValues({ oldPassword: val })}
        label="Mot de passe"
        errors={error?.fields?.old_password}
        required
      />
      <PasswordField
        value={formValues.newPassword}
        handleChange={(val) => updateFormValues({ newPassword: val })}
        label="Nouveau mot de passe"
        errors={error?.fields?.new_password}
        required
      />
      <PasswordField
        value={formValues.confirmNewPassword}
        handleChange={(val) => updateFormValues({ confirmNewPassword: val })}
        showValidateIcon={
          !!formValues.newPassword &&
          formValues.newPassword === formValues.confirmNewPassword
        }
        required
        visibilityIconHidden
        errors={error?.fields?.confirm_new_password}
        label="Confirmer le nouveau mot de passe"
      />
    </>
  );
}
