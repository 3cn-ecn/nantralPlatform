import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Divider, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { passwordResetRequestApi } from '#modules/account/api/passwordReset.api';
import { FlexCol } from '#shared/components/FlexBox/FlexBox';
import { TextField } from '#shared/components/FormFields';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { Spacer } from '#shared/components/Spacer/Spacer';
import { useTranslation } from '#shared/i18n/useTranslation';

export default function ForgotPasswordForm() {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const [formValues, setFormValues] = useState<{
    email: string;
  }>({ email: '' });

  function requestPasswordReset() {
    mutate(formValues?.email);
  }
  const { isPending, mutate, error } = useMutation<
    number,
    { fields: { email: string[] } },
    string
  >({
    mutationFn: passwordResetRequestApi,
    onSuccess: () =>
      navigate('email_sent', { state: { email: formValues.email } }),
  });

  return (
    <>
      <Typography variant="body1" margin={2} textAlign="center">
        {t('resetPassword.provideEmail')}
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
          label="Email"
          value={formValues.email}
          required
          fullWidth
          errors={error?.fields?.email}
          helperText={t('resetPassword.emailHelperText')}
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
            loading={isPending}
            variant="contained"
            type="submit"
            size="large"
            fullWidth
          >
            {t('resetPassword.request')}
          </LoadingButton>
          <Button
            sx={{ maxWidth: 220 }}
            onClick={() => navigate('/login')}
            variant="text"
          >
            {t('resetPassword.backToLogin')}
          </Button>
        </FlexCol>
      </form>
    </>
  );
}
