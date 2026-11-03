import { Link } from 'react-router-dom';

import {
  BugReport as BugReportIcon,
  Home as HomeIcon,
  Replay as ReplayIcon,
} from '@mui/icons-material';
import { Button, Container, Stack, Typography } from '@mui/material';

import { useBreakpoint } from '#shared/hooks/useBreakpoint';
import { useTranslation } from '#shared/i18n/useTranslation';

type ErrorPageContentProps = {
  status?: number;
  retryFn: () => void;
  reloadDocument?: boolean;
} & (
  | { message: string; errorMessage?: never }
  | { errorMessage: string; message?: never }
);

export function ErrorPageContent({
  status,
  message,
  errorMessage,
  retryFn,
  // use this option if the error is not inside a <Routes> component
  reloadDocument = false,
}: ErrorPageContentProps) {
  const { t } = useTranslation();
  const smallBk = useBreakpoint('sm');

  return (
    <Container>
      <Stack spacing={4} sx={{ alignItems: 'center', my: 8 }}>
        <Typography
          component="h1"
          sx={{
            fontSize: smallBk.isSmaller ? 90 : 110,
            fontWeight: 700,
            lineHeight: 1.1,
          }}
        >
          {status || t('error.oups')}
        </Typography>
        <Typography sx={{ textAlign: 'center' }}>
          {errorMessage ? t('error.errorMessage', { errorMessage }) : message}
        </Typography>
        <Button onClick={retryFn} endIcon={<ReplayIcon />} variant="contained">
          {t('error.retry')}
        </Button>
        <Stack
          direction="row"
          sx={{ justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <Button
            component={Link}
            to="/"
            startIcon={<HomeIcon />}
            color="secondary"
            reloadDocument={reloadDocument}
          >
            {t('error.goToHome')}
          </Button>
          <Button
            component={Link}
            to="/feedback"
            startIcon={<BugReportIcon />}
            color="secondary"
            reloadDocument={reloadDocument}
          >
            {t('error.feedback')}
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
