import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const QRCodeTransactionPage: React.FC = () => {
  const { uuid: qrCodeId } = useParams();
  const [amount, setAmount] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Appel à l'API pour créer la transaction
    const response = await fetch(
      '/api/nantralpay/cash-in-qrcode/' + qrCodeId + '/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
        }),
      },
    );

    if (response.ok) {
      console.log('OK');
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
        <button type="submit">Encaisser</button>
      </form>
    </div>
  );
};

export default QRCodeTransactionPage;
