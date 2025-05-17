import { useEffect, useState } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';

import { getQRCodeApi } from '#modules/nantralpay/api/getQRCode.api';
import { Order } from '#modules/nantralpay/types/order.type';
import { useTranslation } from '#shared/i18n/useTranslation';
import { ApiError } from '#shared/infra/errors';
import { buildAbsoluteUrl } from '#shared/utils/urls';

/** A modal to confirm the deletion of a member. */
export function ModalOrderQRCode({
  onClose,
  order,
  open,
}: {
  onClose: () => void;
  open: boolean;
  order: Order;
}) {
  const { t } = useTranslation();
  const [uuid, setUuid] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string>('');
  useEffect(() => {
    getQRCodeApi(order.id)
      .then((qrCode) => {
        setErrorMessage('');
        setUuid(qrCode.uuid);
        console.log(buildAbsoluteUrl(`/nantralpay/cash-in/${qrCode.uuid}/`));
      })
      .catch((error: ApiError) => setErrorMessage(error.message));
  }, [order.id]);

  return (
    <Dialog
      aria-labelledby="customized-dialog-title"
      open={open}
      onClose={onClose}
    >
      <DialogTitle>{t('nantralpay.order.modal.qrcode.title')}</DialogTitle>
      <DialogContent>
        {errorMessage !== '' ? (
          <DialogContentText color="error">{errorMessage}</DialogContentText>
        ) : (
          <>
            <DialogContentText>
              {t('nantralpay.order.modal.qrcode.text')}
            </DialogContentText>
            <QRCodeSVG
              value={buildAbsoluteUrl(`/nantralpay/cash-in/${uuid}/`)}
              width={256}
              height={256}
              marginSize={4}
              imageSettings={{
                src: '/static/img/logo/scalable/logo.svg',
                height: 30,
                width: 30,
                excavate: true,
              }}
              minVersion={6}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()} variant="text">
          {t('button.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
