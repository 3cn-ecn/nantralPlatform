import React from 'react';

import { QRCodeSVG } from 'qrcode.react';

interface GenerateQRCodeProps {
  transactionData: string;
}

const GenerateQRCode: React.FC<GenerateQRCodeProps> = ({ transactionData }) => {
  return (
    <div>
      <QRCodeSVG value={transactionData} size={256} />
    </div>
  );
};

export default GenerateQRCode;
