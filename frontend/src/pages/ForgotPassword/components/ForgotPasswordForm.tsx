import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Divider, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { passwordResetRequestApi } from '#modules/account/api/passwordReset.api';
import { FlexCol } from '#shared/components/FlexBox/FlexBox';
import { TextField } from '#shared/components/FormFields';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { Spacer } from '#shared/components/Spacer/Spacer';

export default function ForgotPasswordForm() {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState<{
    email: string;
  }>({ email: '' });

  function requestPasswordReset() {
    mutate(formValues?.email);
  }
  const { isLoading, mutate, error } = useMutation<
    number,
    { fields: { email: string[] } },
    string
  >(passwordResetRequestApi, {
    onSuccess: () =>
      navigate('email_sent', { state: { email: formValues.email } }),
  });

  return (
    <>
      <Typography variant="body1" margin={2}>
        Please provide your email, we&apos;ll send you a link to reset your
        password
      </Typography>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          requestPasswordReset();
        }}
        style={{ width: '100%', alignItems: 'center' }}
      >
        <TextField
          type="email"
          label="email"
          value={formValues.email}
          required
          fullWidth
          errors={error?.fields?.email}
          helperText={'Email associated with your Nantral Platform account'}
          handleChange={(val) => setFormValues({ ...formValues, email: val })}
        />
        <Spacer vertical={3} />
        <Divider flexItem />
        <Spacer vertical={3} />
        <FlexCol
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <LoadingButton
            loading={isLoading}
            variant="contained"
            type="submit"
            size="large"
            fullWidth
          >
            Request password reset
          </LoadingButton>
          <Button
            sx={{ maxWidth: 220 }}
            onClick={() => navigate('/login')}
            variant="text"
          >
            Back to login
          </Button>
        </FlexCol>
      </form>
    </>
  );
}
