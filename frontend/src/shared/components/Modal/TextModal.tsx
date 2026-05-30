import { useState } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { TextField, TextFieldProps } from '#shared/components/FormFields';
import { useTranslation } from '#shared/i18n/useTranslation';

import { LoadingButton } from '../LoadingButton/LoadingButton';

interface TextModalProps {
  title: string;
  body: string;
  slotProps?: {
    input: Partial<TextFieldProps>;
  };
  oldValue?: string;
  onCancel: () => void;
  onConfirm: (newValue: string) => void;
  loading?: boolean;
}

export function TextModal({
  title,
  body,
  slotProps,
  oldValue,
  onCancel,
  onConfirm,
  loading = false,
}: TextModalProps) {
  const { t } = useTranslation();
  const [value, setValue] = useState(oldValue || '');

  return (
    <Dialog
      open
      onClose={() => onCancel()}
      aria-labelledby="responsive-dialog-title"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onConfirm(value);
        }}
      >
        <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{body}</DialogContentText>
          <TextField
            required
            {...slotProps?.input}
            value={value}
            handleChange={(val) => setValue(val)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onCancel()} variant="text">
            {t('button.cancel')}
          </Button>
          <LoadingButton
            loading={loading}
            variant="contained"
            autoFocus
            type={'submit'}
          >
            {t('button.confirm')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
