import { UUID } from 'crypto';

export interface Transaction {
  id: number;
  qrCode: string;
  amount: number;
  date: Date;
  sender: string;
  receiver: string;
  description: string;
  group: string;
}

export type TransactionPreview = Pick<
  Transaction,
  | 'id'
  | 'qrCode'
  | 'amount'
  | 'date'
  | 'sender'
  | 'receiver'
  | 'description'
  | 'group'
>;

export type TransactionForm = Transaction & {
  qrCode: UUID | null;
};
