import { UUID } from 'crypto';

export interface Transaction {
  id: number;
  qrCode: UUID;
}

export type TransactionPreview = Pick<Transaction, 'id' | 'qrCode'>;

export type TransactionForm = Transaction & {
  qrCode: UUID | null;
};
