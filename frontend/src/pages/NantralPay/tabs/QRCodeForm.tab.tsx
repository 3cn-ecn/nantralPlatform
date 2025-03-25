import React, { useState } from 'react';

import { Button, Typography } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';

import { FlexRow } from '#shared/components/FlexBox/FlexBox';
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
      <Button variant="contained" onClick={handleSubmit}>
        {t('nantralpay.qrcode.button')}
      </Button>

      {QRCodeId && (
        <>
          <Typography variant="h3">{t('nantralpay.qrcode.qrcode')}</Typography>
          <FlexRow>
            <QRCodeSVG
              value={buildAbsoluteUrl(`/nantralpay/cash-in/${QRCodeId}/`)}
              width={256}
              height={256}
              marginSize={4}
              imageSettings={{
                src: '/static/img/logo/scalable/logo.svg',
                height: 20,
                width: 20,
                excavate: true,
              }}
            />
          </FlexRow>
        </>
      )}
    </>
  );
};

export default QRCodeFormTab;
