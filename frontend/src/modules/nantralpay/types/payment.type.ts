export interface Payment {
  id: number;
  amount: number;
  date: Date;
  status: string;
  haOrderId: number;
  haPaymentID: number;
}

export type PaymentPreview = Pick<
  Payment,
  'id' | 'amount' | 'date' | 'status' | 'haOrderId' | 'haPaymentID'
>;
