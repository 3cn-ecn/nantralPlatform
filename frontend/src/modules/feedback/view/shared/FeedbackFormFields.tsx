import { Dispatch, useCallback } from 'react';

import { FormErrorAlert } from '#shared/components/FormErrorAlert/FormErrorAlert';
import { TextField } from '#shared/components/FormFields';
import { RichTextField } from '#shared/components/FormFields/RichTextField';
import { SetObjectStateAction } from '#shared/hooks/useObjectState';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

import { FeedbackForm } from '../../feedback.types';

interface FeedbackFormFieldsProps {
  isError: boolean;
  error: ApiFormError<FeedbackForm> | null;
  formValues: FeedbackForm;
  updateFormValues: Dispatch<SetObjectStateAction<FeedbackForm>>;
}

export function FeedbackFormFields({
  isError,
  error,
  formValues,
  updateFormValues,
}: FeedbackFormFieldsProps) {
  const { t } = useTranslation();

  return (
    <>
      <FormErrorAlert isError={isError} error={error} />
      <TextField
        name="title"
        label={t('feedback.form.fields.title.label')}
        value={formValues.title}
        handleChange={useCallback(
          (val) => updateFormValues({ title: val }),
          [updateFormValues],
        )}
        errors={error?.fields?.title}
      />
      <RichTextField
        label={t('feedback.form.fields.description.label')}
        helperText={t('feedback.form.fields.description.helperText')}
        name="description"
        value={formValues.description}
        handleChange={useCallback(
          (val) => updateFormValues({ description: val }),
          [updateFormValues],
        )}
        errors={error?.fields?.description}
      />
    </>
  );
}
