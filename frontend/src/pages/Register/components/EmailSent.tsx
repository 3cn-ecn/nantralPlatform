import { useNavigate } from 'react-router-dom';

import { MarkEmailReadRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material';

import { BigButton } from '../../../shared/components/Button/BigButton';

export function EmailSent({
  email,
  firstName,
}: {
  onClick: ({ temporary }: { temporary: boolean }) => void;
  email?: string;
  firstName?: string;
}) {
  const navigate = useNavigate();
  return (
    <Box>
      <Typography variant="h4">{`We are nearly done ${
        firstName || ''
      }!`}</Typography>
      <Card sx={{ width: '100%', marginTop: 3 }} variant="elevation">
        <CardContent>
          <Box
            sx={{ justifyContent: 'center', width: '100%', display: 'flex' }}
          >
            <MarkEmailReadRounded sx={{ fontSize: 200 }} color="secondary" />
          </Box>
          <Typography
            variant="h3"
            sx={{ alignItems: 'center', display: 'flex' }}
            color="secondary"
          >
            A confirmation e-mail has been sent to you to confirm your e-mail
            address:
          </Typography>
          {email && (
            <Button
              color="secondary"
              sx={{ margin: 3, textTransform: 'none' }}
              variant="outlined"
              disableFocusRipple
              disableRipple
            >
              {email}
            </Button>
          )}
          <Typography
            variant="body1"
            sx={{ textAlign: 'center', marginLeft: 1, marginTop: 2 }}
            color="primary"
          >
            Click on the link in the email and login to access your account
          </Typography>
        </CardContent>
        <CardActions></CardActions>
      </Card>
      <Box
        sx={{
          marginTop: 2,
          justifyContent: 'space-between',
          width: '100%',
          display: 'flex',
        }}
      >
        <div>
          <Typography sx={{ color: 'gray' }}>Email not received?</Typography>
          <Typography>
            <p>Wait a few minutes, this can sometimes take a long time.</p>
            <p style={{ lineHeight: 1 }}>
              Still Nothing?{' '}
              <Button sx={{ textTransform: 'none' }}>Send again</Button>
            </p>
          </Typography>
        </div>
        <BigButton
          sx={{ width: 200, maxHeight: 50 }}
          onClick={() => navigate('/login')}
        >
          Login
        </BigButton>
      </Box>
    </Box>
  );
}
