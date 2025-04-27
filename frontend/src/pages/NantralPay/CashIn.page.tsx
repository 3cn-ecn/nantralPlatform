import { useParams } from 'react-router-dom';

import { Container, Typography } from '@mui/material';

import { useTranslation } from '#shared/i18n/useTranslation';

export default function CashInPage() {
  const { uuid } = useParams();
  const { t } = useTranslation();
  return (
    <Container sx={{ my: 2 }}>
      <Typography variant={'h1'}>
        {t('nantralpay.cash-in.title', { user: uuid })}
      </Typography>
    </Container>
  );
}
