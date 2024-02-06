import { useSearchParams } from 'react-router-dom';

import { CheckCircle, CloseRounded } from '@mui/icons-material';
import {
  Alert,
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { validateInvitationApi } from '#modules/account/api/invitation.api';
import { BigButton } from '#shared/components/Button/BigButton';

export function RegisterChoice({
  onClick,
}: {
  onClick: ({ temporary }: { temporary: boolean }) => void;
}) {
  const [params] = useSearchParams();

  function validateInvitation() {
    const uuid = params.get('uuid')?.replace('/', ''); // remove trailing slashes
    if (uuid) {
      return validateInvitationApi(uuid).then(() => true);
    }
    return false;
  }

  const {
    data: invitationValid,
    isError,
    isLoading,
  } = useQuery({
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
      <Typography variant="h2">Do I have a Centrale Nantes email?</Typography>
      <Card sx={{ width: '100%', marginTop: 3 }} variant="elevation">
        <CardActionArea disableRipple>
          <CardContent>
            <Typography
              variant="h3"
              sx={{ alignItems: 'center', display: 'flex', gap: 1 }}
            >
              <CheckCircle color="success" fontSize="medium" />
              Yes I have an email at Centrale Nantes
            </Typography>
            <Typography
              variant="body1"
              sx={{ textAlign: 'justify', marginLeft: 1, marginTop: 2 }}
            >
              Si vous avez accès à votre adresse Centrale Nantes (se terminant
              par ec-nantes.fr), vous pouvez continuer votre inscription
            </Typography>
          </CardContent>
          <CardActions sx={{ alignContent: 'flex-end' }}>
            <BigButton
              onClick={(e) => {
                e.preventDefault();
                onClick({ temporary: false });
              }}
            >
              Create an account now
            </BigButton>
          </CardActions>
        </CardActionArea>
      </Card>
      <Card sx={{ width: '100%', marginTop: 3 }} variant="outlined">
        <CardActionArea
          disableRipple
          disableTouchRipple
          disabled={isLoading || !invitationValid}
        >
          <CardContent>
            <Typography
              variant="h3"
              sx={{ alignItems: 'center', display: 'flex', gap: 1 }}
            >
              <CloseRounded color="primary" fontSize="large" />
              No, I don&apos;t have access to my Centrale Nantes address yet.
            </Typography>
            <Typography
              variant="body1"
              sx={{ textAlign: 'justify', marginLeft: 1, marginTop: 2 }}
            >
              {invitationValid
                ? 'In this case you can create a temporary account with your personal email. NB: This account give you access to Nantral Platform for a limited period of time, make sure to change it as soon as you have access to your @ec-nantes email'
                : `In this case, you cannot create an account on Nantral Platform.
              You can, however, create a temporary account if you have an
              invitation link (available on the Onboard home page during the
              summer, for example).`}
            </Typography>
          </CardContent>
          {invitationValid && (
            <CardActions
              sx={{
                alignContent: 'flex-end',
              }}
            >
              <BigButton
                onClick={(e) => {
                  e.preventDefault();
                  onClick({ temporary: true });
                }}
              >
                Create a temporary account
              </BigButton>
            </CardActions>
          )}
        </CardActionArea>
      </Card>
    </Box>
  );
}
