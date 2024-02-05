import { Send as SendIcon } from '@mui/icons-material';
import { Container, Alert, Link } from '@mui/material';

import { TextField, RichTextField } from '#shared/components/FormFields';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';

export default function BugPage() {
  const { t } = useTranslation();

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
      {/* Form */}
      <TextField
        name="Title"
        key="Title"
        label={t('feedback.bug.form.title.label')}
        required
      />
      <RichTextField
        helperText={t('feedback.bug.form.description.helperText')}
        label={t('feedback.bug.form.description.label')}
      />
      <LoadingButton
        type="submit"
        loading={false}
        variant="contained"
        startIcon={<SendIcon />}
      >
        {t('feedback.bug.form.button.label')}
      </LoadingButton>
    </Container>
  );
}
