import { Send as SendIcon } from '@mui/icons-material';
import { Container, Alert, Link } from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { submitFeedback } from '#modules/feedback/api/submitFeedback.api';
import { useFeedbackFormValues } from '#modules/feedback/hooks/useFeedbackFormValues';
import { FeedbackFormFields } from '#modules/feedback/view/shared/FeedbackFormFields';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';

export default function BugPage() {
  const { t } = useTranslation();
  const [formValues, updateFormValues] = useFeedbackFormValues();

  const { error, isLoading, isError, mutate } = useMutation({
    mutationFn: (vals) => submitFeedback('bug', vals),
  });

  const onSubmit = async (e: Event, formValues: FeedbackForm) => {
    e.preventDefault();

    mutate(formValues);
  };

  return (
    <Container>
      <Spacer vertical={4} />
      <Alert severity="info">
        Please make sure that the issue is not already reported by you or
        someone else on Github.{' '}
        <Link
          color="inherit"
          href="https://github.com/3cn-ecn/nantralPlatform/issues/"
        >
          Check here!
        </Link>
      </Alert>
      <Spacer vertical={2} />
      <Alert severity="warning">
        All what you write here will be public for anybody to see. Make sure you
        do not include any sensitive or private information. <br />
        <b>Stay safe!</b>
      </Alert>
      <Spacer vertical={2} />
      <form id="create-feedback-form" onSubmit={(e) => onSubmit(e, formValues)}>
        <FeedbackFormFields
          isError={isError}
          error={error}
          formValues={formValues}
          updateFormValues={updateFormValues}
        />
        <LoadingButton
          type="submit"
          loading={isLoading}
          variant="contained"
          startIcon={<SendIcon />}
          disabled={isLoading}
        >
          {t('feedback.bug.form.button.label')}
        </LoadingButton>
      </form>
    </Container>
  );
}
