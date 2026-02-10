import { Typography } from '@mui/material';

import { EmailForm } from '#modules/account/view/Email/EmailForm';
import { EmailList } from '#modules/account/view/Email/EmailList';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';

interface EmailTabProps {
  userId: number;
}

export default function EmailTab({ userId }: EmailTabProps) {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h2">{t('email.page.title')}</Typography>
      <Spacer vertical={2} />
      <EmailList userId={userId} />
      <Spacer vertical={2} />
      <EmailForm userId={userId} />
    </>
  );
}
