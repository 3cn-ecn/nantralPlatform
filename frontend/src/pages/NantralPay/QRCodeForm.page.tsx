import React, { useState } from 'react';

import { QRCodeSVG } from 'qrcode.react';

import { buildAbsoluteUrl } from '#shared/utils/urls';

const QRCodeFormPage: React.FC = () => {
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
    <div>
      <h1>NantralPay</h1>
      <form onSubmit={handleSubmit}>
        <button type="submit">Générer le QRCode</button>
      </form>

      {QRCodeId && (
        <div>
          <h2>QR Code:</h2>
          <QRCodeSVG
            value={buildAbsoluteUrl(`/nantralpay/cash-in/${QRCodeId}/`)}
          />
        </div>
      )}
    </div>
  );
};

export default QRCodeFormPage;
