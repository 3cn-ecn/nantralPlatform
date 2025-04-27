export interface OrderDTO {
  id: number;
  amount: number;
  payment_date: Date;
  payment_status: string;
  order: number;
  helloasso_payment_id: number;
  description: string;
  receiver: string;
  scanned: boolean;
}
