import { Link as RouterLink } from 'react-router-dom';

import { AlternateEmail as AlternateEmailIcon } from '@mui/icons-material';
import {
  Alert,
  AlertTitle,
  Box,
  CircularProgress,
  Link,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import getUsernameApi from '#modules/account/api/getUsername.api';
import { useTranslation } from '#shared/i18n/useTranslation';

/**
 * This component shows a message to advice users to change their username if they did not change it yet
 */
export default function UpdateUsernameAlert() {
  const { data, isPending, isSuccess } = useQuery({
    queryFn: getUsernameApi,
    queryKey: ['username'],
  });
  const { t } = useTranslation();

  if (isPending) {
    return (
      <Box
        sx={{ display: 'flex', width: '100%', justifyContent: 'center', mb: 3 }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isSuccess && !data?.hasUpdatedUsername) {
    return (
      <Alert
        severity={'success'}
        variant={'outlined'}
        icon={<AlternateEmailIcon sx={{ fontSize: 60 }} />}
        sx={{ mb: 3 }}
      >
        <AlertTitle variant={'h2'}>{t('username.alert.title')}</AlertTitle>
        <Typography fontSize={'large'}>
          {t('username.alert.message1')}{' '}
          <Link
            component={RouterLink}
            to="/update-username"
            underline={'hover'}
          >
            {t('username.alert.link')}
          </Link>{' '}
          {t('username.alert.message2')}
        </Typography>
      </Alert>
    );
  }

  return null;
}
