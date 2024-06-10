import { useObjectState } from '#shared/hooks/useObjectState';
import { useTranslation } from '#shared/i18n/useTranslation';

import { FeedbackForm, FeedbackKind } from '../feedback.types';

export function useFeedbackFormValues(kind: FeedbackKind) {
  const { t } = useTranslation();

  const defaultDescriptions = {
    bug: t('feedback.form.fields.description.template'),
    suggestion: '',
  };
  const defaultValues: FeedbackForm = {
    title: '',
    description: defaultDescriptions[kind],
    kind,
  };

  return useObjectState(defaultValues);
}
