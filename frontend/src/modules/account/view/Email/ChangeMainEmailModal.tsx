import { useState } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import { Email } from '#modules/account/email.type';
import { PasswordField } from '#shared/components/FormFields/PasswordField';
import { LoadingButton } from '#shared/components/LoadingButton/LoadingButton';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiFormError } from '#shared/infra/errors';

interface ChangeMainEmailModalProps {
  email: Email;
  mutate: ({ password }: { password: string }) => void;
  onCancel: () => void;
  reset: () => void;
  errors?: ApiFormError<{ password: string }>;
  isLoading: boolean;
}
export function ChangeMainEmailModal({
  email,
  mutate,
  onCancel,
  reset,
  errors,
  isLoading,
}: ChangeMainEmailModalProps) {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  return (
    <Dialog open onClose={onCancel} aria-labelledby="responsive-dialog-title">
      <DialogTitle id="responsive-dialog-title">
        {t('email.changeModal.title')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('email.changeModal.body', { email: email.email })}
        </DialogContentText>
      </DialogContent>
      <DialogContent>
        <DialogContentText>
          {t('email.changeModal.askPassword')}
        </DialogContentText>
        <PasswordField
          value={password}
          handleChange={(val) => {
            setPassword(val);
            reset();
          }}
          label={t('login.password')}
          errors={errors?.fields.password}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onCancel()} variant="text">
          {t('button.cancel')}
        </Button>
        <LoadingButton
          loading={isLoading}
          onClick={() => mutate({ password: password })}
          variant="contained"
          autoFocus
        >
          {t('button.update')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
