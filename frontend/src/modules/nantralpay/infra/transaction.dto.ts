export interface TransactionDTO {
  qr_code: string;
}

export type TransactionPreviewDTO = Pick<TransactionDTO, 'qr_code'>;

export type TransactionFormDTO = Pick<TransactionDTO, 'qr_code'>;
