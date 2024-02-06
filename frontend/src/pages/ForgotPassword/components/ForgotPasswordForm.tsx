import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
} from '@mui/material';

import { passwordResetRequestApi } from '#modules/account/api/passwordReset.api';
import { BigButton } from '#shared/components/Button/BigButton';
import { TextField } from '#shared/components/FormFields';
import { Spacer } from '#shared/components/Spacer/Spacer';

export function ForgotPasswordForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<{ fields: { email?: string[] } }>({
    fields: {},
  });
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState<{
    email: string;
  }>({ email: '' });

  function requestPasswordReset() {
    setLoading(true);
    passwordResetRequestApi(formValues?.email)
      .then(() => onSuccess())
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    setError({ fields: {} });
  }, [formValues]);

  return (
    <>
      <Typography variant="h6" margin={2}>
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
        <Box
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <BigButton
            sx={{
              width: '100%',
              filter: loading ? 'brightness(0.4)' : undefined,
            }}
            disabled={loading}
            type="submit"
          >
            {loading ? (
              <CircularProgress size={25} />
            ) : (
              'Request password reset'
            )}
          </BigButton>
          <Button
            sx={{ maxWidth: 220 }}
            onClick={() => navigate('/login')}
            variant="text"
          >
            Back to login
          </Button>
        </Box>
      </form>
    </>
  );
}
