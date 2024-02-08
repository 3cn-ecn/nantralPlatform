import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import {
  Button,
  Card,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useTheme,
} from '@mui/material';

import { FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';
import { FloatingContainer } from '#shared/components/FloatingContainer/FloatingContainer';
import { useBreakpoint } from '#shared/hooks/useBreakpoint';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const theme = useTheme();
  const small = useBreakpoint('sm').isSmaller;
  const pathNameToStep = {
    register: 0,
    registerform: 1,
    registervalidation: 2,
  };

  return (
    <FloatingContainer maxWidth={'md'} sx={{ paddingTop: 2, paddingBottom: 2 }}>
      <Card
        sx={{
          padding: 5,
        }}
      >
        <FlexCol alignItems="center">
          <img
            style={{
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
                onClick={() => navigate('/login')}
              >
                Go to the login page
              </Button>
            </FlexRow>
          </Paper>
          <Stepper
            activeStep={pathNameToStep[pathname.replaceAll('/', '')]}
            variant="outlined"
            nonLinear
            sx={{ width: '100%', margin: 2, marginBottom: 4 }}
            orientation={small ? 'vertical' : 'horizontal'}
          >
            <Step>
              <StepLabel>{'Centrale nantes email'}</StepLabel>
            </Step>
            <Step>
              <StepLabel>{'Account creation'}</StepLabel>
            </Step>
            <Step>
              <StepLabel>{'Validation'}</StepLabel>
            </Step>
          </Stepper>
          <Outlet />
        </FlexCol>
      </Card>
    </FloatingContainer>
  );
}
