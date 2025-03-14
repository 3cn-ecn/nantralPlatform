import { TransactionFormDTO } from './transaction.dto';

export function convertTransactionForm(qrCode: string): TransactionFormDTO {
  return {
    qr_code: qrCode,
  };
}
