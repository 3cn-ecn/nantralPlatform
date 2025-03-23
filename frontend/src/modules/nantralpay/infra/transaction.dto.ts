export interface TransactionDTO {
  id: number;
  qr_code: string;
  amount: number;
  transaction_date: string;
  sender: string;
  receiver: string;
  description: string;
  group: string;
}

export type TransactionPreviewDTO = Pick<
  TransactionDTO,
  | 'id'
  | 'qr_code'
  | 'amount'
  | 'transaction_date'
  | 'sender'
  | 'receiver'
  | 'description'
  | 'group'
>;

export type TransactionFormDTO = Pick<TransactionDTO, 'qr_code'>;
