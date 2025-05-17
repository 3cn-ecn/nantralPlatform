export interface OrderDTO {
  id: number;
  amount: number;
  creation_date: Date;
  payment_status: string;
  order: number;
  helloasso_payment_id: number;
  description: string;
  sender: string;
  receiver: string;
  scanned: boolean;
}
