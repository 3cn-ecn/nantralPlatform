import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { useTranslation } from '#shared/i18n/useTranslation';

import { LoadingButton } from '../LoadingButton/LoadingButton';

type ConfirmationModalProps = {
  title: string;
  body: string;
  onClose: () => void;
  onValidCallback: () => void;
  loading?: boolean;
};

export function ConfirmationModal({
  title,
  body,
  onClose,
  onValidCallback,
  loading = false,
}: ConfirmationModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog
      open
      onClose={() => onClose()}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{body}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()} variant="text">
          {t('button.cancel')}
        </Button>
        <LoadingButton
          loading={loading}
          onClick={() => onValidCallback()}
          variant="contained"
          autoFocus
        >
          {t('button.confirm')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
