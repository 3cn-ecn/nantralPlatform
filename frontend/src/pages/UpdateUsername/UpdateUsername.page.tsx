import { Spinner } from 'react-bootstrap';

import { Card, Typography, useTheme } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import getUsernameApi from '#modules/account/api/getUsername.api';
import UpdateUsernameForm from '#pages/UpdateUsername/UpdateUsername.form';
import { Avatar } from '#shared/components/Avatar/Avatar';
import { FloatingContainer } from '#shared/components/FloatingContainer/FloatingContainer';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';

export default function UpdatePassordPage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { data, isSuccess } = useQuery({
    queryKey: ['username'],
    queryFn: getUsernameApi,
  });

  return (
    <FloatingContainer maxWidth={'sm'}>
      <Card
        sx={{
          padding: 5,
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {data?.picture && (
          <>
            <Avatar src={data.picture} alt={data.name} size={'xl'} />
            <Spacer vertical={2} />
          </>
        )}
        <Typography
          variant="h2"
          sx={{
            color: theme.palette.mode == 'dark' ? '#b6b7b7' : '#282828',
          }}
          textAlign="center"
        >
          {data ? data.name : 'Chargement...'}
        </Typography>
        <Typography mt={1} textAlign="center" variant="subtitle1">
          {t('username.update')}
        </Typography>
        <Spacer vertical={2} />
        {isSuccess ? (
          <UpdateUsernameForm username={data?.username || ''} />
        ) : (
          <Spinner />
        )}
      </Card>
    </FloatingContainer>
  );
}
