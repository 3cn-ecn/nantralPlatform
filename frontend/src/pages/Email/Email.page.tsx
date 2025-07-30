import { Button, Container, Typography } from '@mui/material';

import { EmailForm } from '#modules/event/view/Email/EmailForm';
import { EmailList } from '#modules/event/view/Email/EmailList';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';

export default function EmailPage() {
  const { t } = useTranslation();

  return (
    <Container maxWidth="md">
      <Spacer vertical={2} />
      <Typography variant="h1">{t('email.page.title')}</Typography>
      <Spacer vertical={2} />
      <EmailList />
      <Spacer vertical={2} />
      <EmailForm />
      <Spacer vertical={2} />
    </Container>
  );
}
