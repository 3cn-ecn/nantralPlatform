import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { ChevronLeft, Info } from '@mui/icons-material';
import {
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Typography,
} from '@mui/material';

import { RegisterForm } from '#modules/account/account.type';
import { registerApi } from '#modules/account/api/register.api';
import { RegisterFormFields } from '#modules/account/view/shared/RegisterFormFields';
import { Spacer } from '#shared/components/Spacer/Spacer';

import { BigButton } from '../../../shared/components/Button/BigButton';

export function RegisterFormPanel({
  registrationType,
  onSuccess,
  onGoBack,
}: {
  registrationType: 'invitation' | 'normal';
  onGoBack: () => void;
  onSuccess: ({
    email,
    firstName,
  }: {
    email: string;
    firstName: string;
  }) => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<{
    fields: Partial<Record<keyof RegisterForm, string[]>>;
  }>({ fields: {} });
  const [params] = useSearchParams();
  const [formValues, setFormValues] = useState<
    RegisterForm & { passwordConfirm: string }
  >({
    email: '',
    password: '',
    passwordConfirm: '',
    firstName: '',
    lastName: '',
    faculty: { label: 'Ingénieur généraliste', value: 'Gen' },
    promo: new Date().getFullYear(),
    path: { label: 'None', value: 'Cla' },
  });

  useEffect(() => {
    setError({ fields: {} });
  }, [formValues]);

  async function register() {
    if (
      formValues?.password &&
      formValues?.password !== formValues?.passwordConfirm
    ) {
      setError({ fields: { passwordConfirm: ["Passwords don't match"] } });
      return;
    }
    setLoading(true);
    if (registrationType === 'invitation') {
      const uuid = params.get('uuid')?.replace('/', '');
      formValues.invitationUUID = uuid;
    }
    try {
      const res = await registerApi(formValues);
      if (res) {
        onSuccess({
          firstName: formValues?.firstName,
          email: formValues?.email,
        });
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <Card>
        <CardContent>
          <Typography
            sx={{
              textAlign: 'justify',
            }}
          >
            <Info
              fontSize="medium"
              sx={{ marginRight: 1, color: 'secondary', paddingTop: 0.8 }}
            />
            To sign up for Nantral Platform, you have to be currently at
            Centrale Nantes. To verify it, we use your email address that should
            end with <b>@eleves.ec-nantes.fr</b> or <b>@ec-nantes.fr</b>.
          </Typography>
        </CardContent>
      </Card>

      <Spacer vertical={2} />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          register();
        }}
      >
        <RegisterFormFields
          formValues={formValues}
          updateFormValues={(newValues) =>
            setFormValues({ ...formValues, ...newValues })
          }
          error={error}
          registrationType={registrationType}
        />
        <Divider flexItem />
        <Spacer vertical={3} />
        <div style={{ justifyContent: 'space-between', display: 'flex' }}>
          <BigButton
            sx={{ width: '25%', background: 'none' }}
            color="secondary"
            variant="text"
            startIcon={<ChevronLeft />}
            onClick={() => onGoBack()}
          >
            Back
          </BigButton>
          <BigButton
            sx={{
              width: '25%',
              filter: loading ? 'brightness(0.4)' : undefined,
            }}
            disabled={loading}
            variant="contained"
            type="submit"
          >
            {loading ? <CircularProgress size={30} /> : 'Register'}
          </BigButton>
        </div>
      </form>
    </>
  );
}
