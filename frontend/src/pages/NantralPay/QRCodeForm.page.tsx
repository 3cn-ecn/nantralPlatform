import React, { useState } from 'react';

import { QRCodeSVG } from 'qrcode.react';

const QRCodeFormPage: React.FC = () => {
  // Get the host name in order to create the QR code
  const currentHost = `${window.location.protocol}//${window.location.hostname}`;

  const [amount, setAmount] = useState<number>(0);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Appel à l'API pour créer la transaction
    const response = await fetch('/api/nantralpay/create-transaction/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setTransactionId(data.transaction_id);
      console.log(
        currentHost + `/api/nantralpay/cash-in-qrcode/${data.transaction_id}/`,
      );
    } else {
      console.error('Erreur lors de la création de la transaction');
    }
  };

  return (
    <div>
      <h1>NantralPay</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="amount">Montant</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
          />
        </div>
        <button type="submit">Générer le QRCode</button>
      </form>

      {transactionId && (
        <div>
          <h2>QR Code:</h2>
          <QRCodeSVG
            value={
              currentHost + `/api/nantralpay/cash-in-qrcode/${transactionId}/`
            }
          />
        </div>
      )}
    </div>
  );
};

export default QRCodeFormPage;
