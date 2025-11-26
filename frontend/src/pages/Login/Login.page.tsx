import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Check } from '@mui/icons-material';
import {
  Alert,
  Button,
  Card,
  Divider,
  Typography,
  useTheme,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { resendVerificationEmailApi } from '#modules/account/api/email.api';
import { LoginFormFields } from '#modules/account/view/shared/LoginFormFields';
import { FlexCol, FlexRow } from '#shared/components/FlexBox/FlexBox';
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
    email_ecn?: string;
  }>({ email: '', password: '' });

  const {
    isSuccess: isResendSuccess,
    mutate,
    isPending: isResendPending,
  } = useMutation({ mutationFn: resendVerificationEmailApi });

  const { login, error, isPending } = useAuth();

  if (error?.response?.data.code == '5') {
    setFormValues((f) => ({ ...f, email_ecn: undefined }));
  }

  return (
    <FloatingContainer maxWidth={'sm'}>
      <FlexCol gap={3}>
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
              <Alert
                severity="error"
                action={
                  (error?.response?.data?.code == '1' ||
                    error?.response?.data?.emails_ecn) /* Email not valid */ &&
                  (isResendSuccess ? (
                    <Check color="success" />
                  ) : (
                    <LoadingButton
                      loading={isResendPending}
                      variant="outlined"
                      color="inherit"
                      size="small"
                      sx={{ textTransform: 'none' }}
                      onClick={() => {
                        if (error?.response?.data?.code == '1') {
                          mutate(formValues.email);
                        } else {
                          error?.response?.data.emails_ecn?.forEach((email) =>
                            mutate(email),
                          );
                        }
                      }}
                    >
                      {t('register.sendAgain')}
                    </LoadingButton>
                  ))
                }
              >
                {error?.response?.data?.message}
              </Alert>
            )}
            <LoginFormFields
              formValues={formValues}
              updateFormValues={(newValues) =>
                setFormValues({ ...formValues, ...newValues })
              }
              error={error}
              isError={!!error}
              prevData={undefined}
              askEcnEmail={
                error?.response?.data?.code == '2' || !!error?.fields?.email_ecn
              }
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
              loading={isPending}
            >
              {t('login.login')}
            </LoadingButton>
          </form>
        </Card>
        <SeeGroupsButton />
      </FlexCol>
    </FloatingContainer>
  );
}
