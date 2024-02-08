import { Dispatch, useCallback } from 'react';

import { FormErrorAlert } from '#shared/components/FormErrorAlert/FormErrorAlert';
import { TextField } from '#shared/components/FormFields';
import { RichTextField } from '#shared/components/FormFields/RichTextField';
import { SetObjectStateAction } from '#shared/hooks/useObjectState';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

import { FeedbackType, Feedback, FeedbackForm } from '../../feedback.types';

interface FeedbackFormFieldsProps {
  isError: boolean;
  error: ApiFormError<Feedback> | null;
  formValues: FeedbackForm;
  updateFormValues: Dispatch<SetObjectStateAction<FeedbackForm>>;
  type: FeedbackType;
}

export function FeedbackFormFields({
  isError,
  error,
  formValues,
  updateFormValues,
  type,
}: FeedbackFormFieldsProps) {
  const { t } = useTranslation();

  return (
    <>
      <FormErrorAlert isError={isError} error={error} />
      <TextField
        name="title"
        key="title"
        label={t(`feedback.${type}.form.title.label`)}
        value={formValues.title}
        handleChange={useCallback(
          (val) => {
            updateFormValues((prevState) => ({
              ...prevState,
              title: val,
            }));
          },
          [updateFormValues],
        )}
        errors={error?.fields?.title}
        required
      />
      <RichTextField
        label={t(`feedback.${type}.form.description.label`)}
        placeholder={t(`feedback.${type}.form.description.placeholder`)}
        name="description"
        key="description"
        value={formValues.description}
        handleChange={useCallback(
          (val) => {
            updateFormValues((prevState) => ({
              ...prevState,
              description: val,
            }));
          },
          [updateFormValues],
        )}
        errors={error?.fields?.description}
        required
      />
    </>
  );
}
