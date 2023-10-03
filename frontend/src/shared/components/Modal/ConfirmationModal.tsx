import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { useTranslation } from '#shared/i18n/useTranslation';

import { LoadingButton } from '../LoadingButton/LoadingButton';

interface ConfirmationModalProps {
  title: string;
  body: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export function ConfirmationModal({
  title,
  body,
  onCancel,
  onConfirm,
  loading = false,
}: ConfirmationModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog
      open
      onClose={() => onCancel()}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{body}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onCancel()} variant="text">
          {t('button.cancel')}
        </Button>
        <LoadingButton
          loading={loading}
          onClick={() => onConfirm()}
          variant="contained"
          autoFocus
        >
          {t('button.confirm')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
