import { Dispatch } from 'react';

import { SocialLinkDTO } from '#modules/social_link/infra/socialLink.dto';
import { SocialLinkForm } from '#modules/social_link/types/socialLink.type';
import { TextField } from '#shared/components/FormFields';
import { SetObjectStateAction } from '#shared/hooks/useObjectState';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

interface SocialLinkFormFieldsProps {
  isError: boolean;
  error: ApiFormError<SocialLinkDTO> | null;
  formValues: SocialLinkForm;
  updateFormValues: Dispatch<SetObjectStateAction<SocialLinkForm>>;
}

export function SocialLinkFormFields({
  formValues,
  error,
  updateFormValues,
}: SocialLinkFormFieldsProps) {
  const { t } = useTranslation();

  return (
    <>
      <TextField
        handleChange={(val) => {
          updateFormValues({ uri: val });
        }}
        type={'url'}
        label={t('socialLink.form.url.label')}
        helperText={t('socialLink.form.url.description')}
        value={formValues.uri}
        errors={error?.fields?.uri}
        required
      />
      <TextField
        label={t('socialLink.form.label.label')}
        handleChange={(val) => {
          updateFormValues({ label: val });
        }}
        value={formValues.label}
      />
    </>
  );
}
