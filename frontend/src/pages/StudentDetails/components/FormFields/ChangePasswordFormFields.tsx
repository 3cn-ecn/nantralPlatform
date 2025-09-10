import { PasswordField } from '#shared/components/FormFields/PasswordField';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

import { ChangePasswordForm } from '../EditProfile/ChangePassword.tab';

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
  }> | null;
  updateFormValues: (val: Partial<ChangePasswordForm>) => void;
}) {
  const { t } = useTranslation();
  return (
    <>
      <PasswordField
        value={formValues.oldPassword}
        handleChange={(val) => updateFormValues({ oldPassword: val })}
        label={t('student.currentPassword.label')}
        errors={error?.fields?.old_password}
        required
      />
      <PasswordField
        value={formValues.newPassword}
        handleChange={(val) => updateFormValues({ newPassword: val })}
        label={t('student.newPassword.label')}
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
        label={t('student.confirmNewPassword')}
      />
    </>
  );
}
