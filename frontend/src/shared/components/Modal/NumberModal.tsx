import { useState } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import {
  NumberField,
  NumberFieldProps,
} from '#shared/components/FormFields/NumberField';
import { useTranslation } from '#shared/i18n/useTranslation';

import { LoadingButton } from '../LoadingButton/LoadingButton';

interface NumberModalProps extends Omit<
  NumberFieldProps,
  'handleChange' | 'value'
> {
  title?: string;
  oldValue?: number | null;
  onCancel: () => void;
  onConfirm: (newValue: number | null) => void;
  loading?: boolean;
}

export function NumberModal({
  title,
  label,
  oldValue,
  onCancel,
  onConfirm,
  loading = false,
  ...props
}: NumberModalProps) {
  const { t } = useTranslation();
  const [value, setValue] = useState(oldValue ?? null);

  return (
    <Dialog
      open
      onClose={() => onCancel()}
      aria-labelledby="number-dialog-title"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onConfirm(value);
        }}
      >
        <DialogTitle id="number-dialog-title">
          {title || t('modal.numberEdit.title', { label })}
        </DialogTitle>
        <DialogContent>
          <NumberField
            {...props}
            value={value}
            handleChange={(val) => setValue(val)}
            label={label}
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
