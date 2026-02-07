import { Typography } from '@mui/material';

import { EmailForm } from '#modules/account/view/Email/EmailForm';
import { EmailList } from '#modules/account/view/Email/EmailList';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';

interface EmailTabProps {
  studentId: number;
}

export default function EmailTab({ studentId }: EmailTabProps) {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h2">{t('email.page.title')}</Typography>
      <Spacer vertical={2} />
      <EmailList studentId={studentId} />
      <Spacer vertical={2} />
      <EmailForm studentId={studentId} />
    </>
  );
}
