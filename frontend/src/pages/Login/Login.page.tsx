import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Alert,
  Button,
  Card,
  Divider,
  Typography,
  useTheme,
} from '@mui/material';

import { LoginFormFields } from '#modules/account/view/shared/LoginFormFields';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { FloatingContainer } from '#shared/components/FloatingContainer/FloatingContainer';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useAuth } from '#shared/context/Auth.context';
import { useTranslation } from '#shared/i18n/useTranslation';

import { SeeGroupsButton } from './components/SeeGroups';

export default function LoginPage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState<{
    email: string;
    password: string;
  }>({ email: '', password: '' });

  const { login, error, isLoading } = useAuth();

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
        <FlexRow
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            columnGap: 2,
            rowGap: 1,
          }}
        >
          <img
            style={{
              width: 50,
              height: 50,
              border: 'solid',
              borderRadius: '50%',
              borderColor: 'gray',
              borderWidth: 2,
            }}
            src="/static/img/logo/scalable/logo.svg"
            alt="Nantral platform"
          />
          <Typography
            variant="h2"
            sx={{
              color: theme.palette.mode == 'dark' ? '#b6b7b7' : '#282828',
            }}
            textAlign="center"
          >
            Nantral Platform.
          </Typography>
        </FlexRow>
        <Typography mt={1} textAlign="center" variant="subtitle1">
          {t('login.website.ecn')}
        </Typography>
        <Spacer vertical={2} />
        <form
          onSubmit={(event) => {
            event.preventDefault();
            login(formValues);
          }}
        >
          {error?.response?.data?.message && (
            <Alert severity="error">{error?.response?.data?.message}</Alert>
          )}
          <LoginFormFields
            formValues={formValues}
            updateFormValues={(newValues) =>
              setFormValues({ ...formValues, ...newValues })
            }
            error={error}
            isError={!!error}
            prevData={undefined}
          />
          <FlexRow
            sx={{
              justifyContent: 'space-between',
              mt: 2,
              mb: 1,
            }}
          >
            <Button onClick={() => navigate('/register')}>
              {t('login.noAccount')}
            </Button>
            <Button onClick={() => navigate('/forgot_password')}>
              {t('resetPassword.forgotten')}
            </Button>
          </FlexRow>
          <Divider flexItem />
          <Spacer vertical={3} />
          <LoadingButton
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            loading={isLoading}
          >
            {t('login.login')}
          </LoadingButton>
        </form>
      </Card>
      <Spacer vertical={3} />
      <SeeGroupsButton />
    </FloatingContainer>
  );
}
