import { Link } from 'react-router-dom';

import {
  BugReport as BugReportIcon,
  Home as HomeIcon,
  Replay as ReplayIcon,
} from '@mui/icons-material';
import { Button, Container, Typography } from '@mui/material';

import { useBreakpoint } from '#shared/hooks/useBreakpoint';
import { useTranslation } from '#shared/i18n/useTranslation';

import { FlexCol, FlexRow } from '../FlexBox/FlexBox';

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
      <FlexCol alignItems="center" gap={4} my={8}>
        <Typography
          component="h1"
          fontSize={smallBk.isSmaller ? 90 : 110}
          fontWeight={700}
          lineHeight={1.1}
        >
          {status || t('error.oups')}
        </Typography>
        <Typography textAlign="center">
          {errorMessage ? t('error.errorMessage', { errorMessage }) : message}
        </Typography>
        <Button onClick={retryFn} endIcon={<ReplayIcon />} variant="contained">
          {t('error.retry')}
        </Button>
        <FlexRow justifyContent="center" gap={1} flexWrap="wrap">
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
        </FlexRow>
      </FlexCol>
    </Container>
  );
}
