import { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { Send as SendIcon } from '@mui/icons-material';
import { Alert, Button, Container, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { submitFeedback } from '#modules/feedback/api/submitFeedback.api';
import { FeedbackForm, FeedbackKind } from '#modules/feedback/feedback.types';
import { useFeedbackFormValues } from '#modules/feedback/hooks/useFeedbackFormValues';
import { FeedbackFormFields } from '#modules/feedback/view/shared/FeedbackFormFields';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useToast } from '#shared/context/Toast.context';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

interface FeedbackHomePageProps {
  kind: FeedbackKind;
}

export default function FeedbackFormPage({ kind }: FeedbackHomePageProps) {
  const { t } = useTranslation();
  const [formValues, updateFormValues] = useFeedbackFormValues(kind);
  const navigate = useNavigate();
  const showToast = useToast();

  const { error, isPending, isError, mutate } = useMutation<
    number,
    ApiFormError<FeedbackForm>,
    FeedbackForm
  >({
    mutationFn: (data: FeedbackForm) => submitFeedback(data),
    onSuccess: () => {
      navigate('/');
      showToast({
        message: t('feedback.form.success'),
        variant: 'success',
      });
    },
  });

  const onSubmit = async (
    e: FormEvent<HTMLFormElement>,
    data: FeedbackForm,
  ) => {
    e.preventDefault();
    mutate(data);
  };

  const pageTitles: Record<FeedbackKind, string> = {
    bug: t('feedback.form.title.bug'),
    suggestion: t('feedback.form.title.suggestion'),
  };

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Typography variant="h1" gutterBottom>
        {pageTitles[kind]}
      </Typography>
      <Alert
        severity="info"
        action={
          <Button
            color="inherit"
            size="small"
            href="https://github.com/3cn-ecn/nantralPlatform/issues/"
            target="_blank"
            rel="noopener"
          >
            {t('feedback.form.pleaseCheckIssues.button')}
          </Button>
        }
      >
        {t('feedback.form.pleaseCheckIssues.text')}
      </Alert>
      <Spacer vertical={2} />
      <form onSubmit={(e) => onSubmit(e, formValues)}>
        <FeedbackFormFields
          isError={isError}
          error={error}
          formValues={formValues}
          updateFormValues={updateFormValues}
        />
        <LoadingButton
          type="submit"
          loading={isPending}
          variant="contained"
          startIcon={<SendIcon />}
          sx={{ ms: 'auto' }}
        >
          {t('feedback.form.submitButton.label')}
        </LoadingButton>
      </form>
    </Container>
  );
}
