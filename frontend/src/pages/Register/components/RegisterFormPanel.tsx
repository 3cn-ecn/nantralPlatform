import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { ChevronLeft, Info } from '@mui/icons-material';
import { Button, Divider, Paper, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { RegisterCreated, RegisterForm } from '#modules/account/account.type';
import { registerApi } from '#modules/account/api/register.api';
import { RegisterFormFields } from '#modules/account/view/shared/RegisterFormFields';
import { FlexRow } from '#shared/components/FlexBox/FlexBox';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { Spacer } from '#shared/components/Spacer/Spacer';

export default function RegisterFormPanel() {
  const [params] = useSearchParams();
  const uuid = params.get('uuid') || undefined;
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
    invitationUUID: uuid,
  });
  const navigate = useNavigate();
  const {
    isLoading: loading,
    error,
    mutate,
  } = useMutation<
    RegisterCreated,
    {
      fields: Partial<Record<keyof RegisterForm, string[]>>;
    },
    RegisterForm
  >(register, {
    onSuccess: (data) =>
      navigate('/register/validation', {
        state: { email: data?.email, firstName: data?.firstName },
      }),
  });

  async function register(form: RegisterForm) {
    if (form?.password && form?.password !== form?.passwordConfirm) {
      throw {
        fields: { passwordConfirm: ["Passwords don't match"] },
      };
    }
    return registerApi(form);
  }

  return (
    <>
      <Paper sx={{ p: 2, justifyContent: 'center', display: 'flex' }}>
        <Info sx={{ m: 0 }} />
        <Typography component={'span'} textAlign={'center'}>
          To sign up for Nantral Platform, you have to be currently at Centrale
          Nantes. To verify it, we use your email address that should end with{' '}
          <b>@eleves.ec-nantes.fr</b> or <b>@ec-nantes.fr</b>.
        </Typography>
      </Paper>

      <Spacer vertical={2} />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          mutate(formValues);
        }}
      >
        <RegisterFormFields
          formValues={formValues}
          updateFormValues={(newValues) =>
            setFormValues({ ...formValues, ...newValues })
          }
          error={error}
          registrationType={uuid ? 'invitation' : 'normal'}
        />
        <Divider flexItem />
        <Spacer vertical={3} />
        <FlexRow justifyContent={'space-between'}>
          <Button
            sx={{ background: 'none' }}
            color="secondary"
            variant="text"
            startIcon={<ChevronLeft />}
            onClick={() => history.back()}
            size="large"
          >
            Back
          </Button>
          <LoadingButton
            loading={loading}
            variant="contained"
            type="submit"
            size="large"
          >
            Register
          </LoadingButton>
        </FlexRow>
      </form>
    </>
  );
}
