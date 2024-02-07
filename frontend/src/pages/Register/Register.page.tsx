import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Card,
  Container,
  Icon,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useTheme,
} from '@mui/material';

import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { useBreakpoint } from '#shared/hooks/useBreakpoint';

import { EmailSent } from './components/EmailSent';
import { RegisterChoice } from './components/RegisterChoice';
import { RegisterFormPanel } from './components/RegisterFormPanel';

export default function RegisterPage() {
  const [registrationType, setRegistrationType] = useState<
    undefined | 'normal' | 'invitation'
  >(undefined);
  const navigate = useNavigate();
  const theme = useTheme();
  const [step, setStep] = useState(0);
  const [userInfo, setUserInfo] = useState<
    | {
        email: string;
        firstName: string;
      }
    | undefined
  >(undefined);
  const small = useBreakpoint('sm').isSmaller;
  return (
    <Container maxWidth={'md'} sx={{ paddingTop: 2, paddingBottom: 2 }}>
      <Card
        sx={{
          padding: 5,
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          animationDuration: '2s',
        }}
        variant="outlined"
      >
        <Icon
          component="img"
          sx={{
            width: 50,
            height: 50,
            border: 'solid',
            borderRadius: '50%',
            borderColor: '#b6b7b7',
            borderWidth: 1,
          }}
          src="/static/img/logo/scalable/logo.svg"
          alt="Nantral platform"
        />
        <Typography
          sx={{
            textAlign: 'center',
            width: '100%',
            color: theme.palette.mode == 'dark' ? '#b6b7b7' : '#282828',
          }}
          m={2}
          variant="h2"
        >
          Create your Nantral Platform account
        </Typography>

        <Paper
          sx={{
            color: 'gray',
            pl: 2,
            pr: 2,
            gap: 4,
            mb: 1,
          }}
        >
          <FlexRow alignItems="center" gap={1}>
            <Typography>Already have an account?</Typography>
            <Button
              sx={{ textTransform: 'none' }}
              onClick={() => navigate('/login/')}
            >
              Go to the login page
            </Button>
          </FlexRow>
        </Paper>
        <Stepper
          activeStep={step}
          variant="outlined"
          nonLinear
          sx={{ width: '100%', margin: 2, marginBottom: 4 }}
          orientation={small ? 'vertical' : 'horizontal'}
        >
          <Step>
            <StepLabel
              onClick={() => {
                setRegistrationType(undefined);
                setStep(0);
              }}
            >
              {'Centrale nantes email'}
            </StepLabel>
          </Step>
          <Step>
            <StepLabel>{'Account creation'}</StepLabel>
          </Step>
          <Step>
            <StepLabel>{'Validation'}</StepLabel>
          </Step>
        </Stepper>
        {step == 0 && (
          <RegisterChoice
            onClick={({ temporary }) => {
              setRegistrationType(temporary ? 'invitation' : 'normal');
              setStep(1);
            }}
          />
        )}
        {step == 1 && registrationType && (
          <RegisterFormPanel
            registrationType={registrationType}
            onGoBack={() => setStep(0)}
            onSuccess={(res) => {
              setUserInfo(res);
              setStep(2);
            }}
          />
        )}
        {step == 2 && (
          <EmailSent
            onClick={() => null}
            email={userInfo?.email}
            firstName={userInfo?.firstName}
          />
        )}
      </Card>
    </Container>
  );
}
