import { useNavigate } from 'react-router-dom';

import { Send as SendIcon } from '@mui/icons-material';
import { Container, Alert, Link, Snackbar } from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { submitFeedback } from '#modules/feedback/api/submitFeedback.api';
import { Feedbacktype } from '#modules/feedback/feedback.types';
import { useFeedbackFormValues } from '#modules/feedback/hooks/useFeedbackFormValues';
import { FeedbackFormFields } from '#modules/feedback/view/shared/FeedbackFormFields';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';

interface FeedbackSubmitPageProps {
  type: Feedbacktype;
}

export default function FeedbackSubmitPage({ type }: FeedbackSubmitPageProps) {
  const { t } = useTranslation();
  const [formValues, updateFormValues] = useFeedbackFormValues();
  const navigate = useNavigate();

  const { error, isLoading, isError, mutate, isSuccess } = useMutation({
    mutationFn: (vals) => submitFeedback(type, vals),
    onSuccess: () => setTimeout(() => navigate('/'), 1000), // Navigate back home after 1 second
  });

  const onSubmit = async (e: Event, formValues: FeedbackForm) => {
    e.preventDefault();
    mutate(formValues);
  };

  return (
    <Container>
      <Spacer vertical={4} />
      <Alert severity="info">
        Please make sure that the {type} is not already{' '}
        {type == 'bug' ? 'reported' : 'proposed'} by you or someone else{' '}
        <Link
          color="inherit"
          href="https://github.com/3cn-ecn/nantralPlatform/issues/"
        >
          on our bug and suggestions list
        </Link>
        .
      </Alert>
      <Spacer vertical={2} />
      <Alert severity="warning">
        All what you write here will be public for anybody to see. Make sure you
        do not include any sensitive or private information.
        <br />
        <b>Stay safe!</b>
      </Alert>
      <Spacer vertical={2} />
      <form id="create-feedback-form" onSubmit={(e) => onSubmit(e, formValues)}>
        <FeedbackFormFields
          isError={isError}
          error={error}
          formValues={formValues}
          updateFormValues={updateFormValues}
          type={type}
        />
        <LoadingButton
          type="submit"
          loading={isLoading}
          variant="contained"
          startIcon={<SendIcon />}
          disabled={isLoading}
        >
          {t(`feedback.${type}.form.button.label`)}
        </LoadingButton>
      </form>
      <Snackbar open={isSuccess}>
        <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
          Your {type} has been saved successfully. Thank your for your time{' '}
        </Alert>
      </Snackbar>
    </Container>
  );
}
