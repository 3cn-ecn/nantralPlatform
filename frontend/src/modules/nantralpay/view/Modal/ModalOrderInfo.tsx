import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import { Order } from '#modules/nantralpay/types/order.type';
import { useTranslation } from '#shared/i18n/useTranslation';

/** A modal to confirm the deletion of a member. */
export function ModalOrderInfo({
  onClose,
  order,
  open,
}: {
  onClose: () => void;
  open: boolean;
  order: Order;
}) {
  const { t } = useTranslation();

  return (
    <Dialog
      aria-labelledby="customized-dialog-title"
      open={open}
      onClose={onClose}
    >
      <DialogTitle>{t('nantralpay.order.modal.info.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{order.description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()} variant="text">
          {t('button.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
