import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import { CheckCircle, CloseRounded } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { validateInvitationApi } from '#modules/account/api/invitation.api';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { useTranslation } from '#shared/i18n/useTranslation';

export default function RegisterChoice() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const uuid = params.get('uuid')?.replace('/', ''); // remove trailing slashes

  function validateInvitation() {
    if (uuid) {
      return validateInvitationApi(uuid).then(() => true);
    }
    return false;
  }

  const { data: invitationValid, isError } = useQuery({
    queryFn: validateInvitation,
    queryKey: ['validateInvitation', params],
    retry: false,
  });

  return (
    <Box>
      {isError && (
        <Alert sx={{ marginBottom: 2 }} severity="error">
          {
            'The invitation link provided is invalid. Make sure you have copied it correctly.'
          }
        </Alert>
      )}
      <Typography variant="h2">
        {t('register.haveECNEmail.question')}
      </Typography>
      <Card
        sx={{
          width: '100%',
          marginTop: 3,
          border: 'solid',
          borderWidth: 1,
          borderColor: 'success',
        }}
        variant="elevation"
      >
        <CardContent>
          <FlexRow alignItems="center" gap={1}>
            <CheckCircle color="success" fontSize="medium" />
            <Typography
              variant="h3"
              sx={{ alignItems: 'center', display: 'flex', gap: 1 }}
            >
              {t('register.haveECNEmail.yes')}
            </Typography>
          </FlexRow>
          <Typography
            variant="body1"
            sx={{ textAlign: 'justify', marginLeft: 1, marginTop: 2 }}
          >
            {t('register.haveECNEmail.canContinue')}
          </Typography>
        </CardContent>
        <CardActions sx={{ alignContent: 'flex-end' }}>
          <Button
            onClick={() => {
              navigate('form');
            }}
            size="large"
            fullWidth
            variant="contained"
          >
            {t('register.createAccountNow')}
          </Button>
        </CardActions>
      </Card>
      <Card sx={{ width: '100%', marginTop: 3 }} variant="outlined">
        <CardContent>
          <FlexRow alignItems="center" gap={1}>
            <CloseRounded color="primary" fontSize="large" />
            <Typography variant="h3">
              {t('register.haveECNEmail.no')}
            </Typography>
          </FlexRow>
          <Typography
            variant="body1"
            sx={{ textAlign: 'justify', marginLeft: 1, marginTop: 2 }}
          >
            {invitationValid
              ? t('register.canCreateTemporaryAccount')
              : t('register.canNotCreateAccount')}
          </Typography>
        </CardContent>
        {uuid && invitationValid && (
          <CardActions sx={{ alignContent: 'flex-end' }}>
            <Button
              onClick={() => {
                navigate({
                  pathname: 'form',
                  search: createSearchParams({ uuid: uuid }).toString(),
                });
              }}
              size="large"
              fullWidth
              variant="contained"
            >
              {t('register.createTemporaryAccount')}
            </Button>
          </CardActions>
        )}
      </Card>
    </Box>
  );
}
