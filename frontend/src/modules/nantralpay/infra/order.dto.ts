export interface OrderDTO {
  id: number;
  amount: number;
  creation_date: Date;
  status: string;
  helloasso_order_id: number;
  description: string;
  sender: string;
  receiver: string;
}
