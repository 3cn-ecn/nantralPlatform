import React, { useState } from 'react';

import { Button, Typography } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';

import { useTranslation } from '#shared/i18n/useTranslation';
import { buildAbsoluteUrl } from '#shared/utils/urls';

const QRCodeFormTab: React.FC = () => {
  const { t } = useTranslation();
  const [QRCodeId, setQRCodeId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Appel à l'API pour créer le QR Code
    const response = await fetch('/api/nantralpay/create-qrcode/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      setQRCodeId(data.qr_code_id);
      console.log(buildAbsoluteUrl(`/nantralpay/cash-in/${data.qr_code_id}/`));
    } else {
      console.error('Erreur lors de la création de la transaction');
    }
  };

  return (
    <>
      <Typography variant="h2">{t('nantralpay.qrcode.title')}</Typography>
      <Button variant="contained" onClick={handleSubmit}>
        {t('nantralpay.qrcode.button')}
      </Button>

      {QRCodeId && (
        <>
          <Typography variant="h3">{t('nantralpay.qrcode.qrcode')}</Typography>
          <QRCodeSVG
            value={buildAbsoluteUrl(`/nantralpay/cash-in/${QRCodeId}/`)}
          />
        </>
      )}
    </>
  );
};

export default QRCodeFormTab;
