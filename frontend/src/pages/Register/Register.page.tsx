import { Outlet, useLoaderData, useNavigate } from 'react-router-dom';

import {
  Button,
  Card,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useTheme,
} from '@mui/material';

import { FloatingContainer } from '#shared/components/FloatingContainer/FloatingContainer';
import { useBreakpoint } from '#shared/hooks/useBreakpoint';
import { useTranslation } from '#shared/i18n/useTranslation';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { activeStep } = useLoaderData();
  const theme = useTheme();
  const small = useBreakpoint('sm').isSmaller;

  return (
    <FloatingContainer maxWidth={'md'}>
      <Card
        sx={{
          padding: 5,
        }}
      >
        <Stack sx={{ alignItems: 'center' }}>
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
              m: 2,
              textAlign: 'center',
              width: '100%',
              color: theme.palette.mode == 'dark' ? '#b6b7b7' : '#282828',
            }}
            variant="h2"
          >
            {t('register.createAccount')}
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
            <Stack direction="row" sx={{ alignItems: 'center' }} spacing={1}>
              <Typography>{t('register.alreadyHaveAccount')}</Typography>
              <Button
                sx={{ textTransform: 'none' }}
                onClick={() => navigate('/login')}
              >
                {t('register.goLoginPage')}
              </Button>
            </Stack>
          </Paper>
          <Stepper
            activeStep={activeStep}
            variant="outlined"
            nonLinear
            sx={{ width: '100%', margin: 2, marginBottom: 4 }}
            orientation={small ? 'vertical' : 'horizontal'}
          >
            <Step>
              <StepLabel>{t('register.EmailECN')}</StepLabel>
            </Step>
            <Step>
              <StepLabel>{t('register.accountCreation')}</StepLabel>
            </Step>
            <Step>
              <StepLabel>{t('register.validation')}</StepLabel>
            </Step>
          </Stepper>
          <Outlet />
        </Stack>
      </Card>
    </FloatingContainer>
  );
}
