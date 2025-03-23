export interface PaymentDTO {
  id: number;
  amount: number;
  payment_date: Date;
  payment_status: string;
  order: number;
  helloasso_payment_id: number;
}

export type PaymentPreviewDTO = Pick<
  PaymentDTO,
  | 'id'
  | 'amount'
  | 'payment_date'
  | 'payment_status'
  | 'order'
  | 'helloasso_payment_id'
>;
