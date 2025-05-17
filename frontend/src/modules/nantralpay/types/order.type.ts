export interface Order {
  id: number;
  amount: number;
  date: Date;
  status: string;
  haOrderId: number;
  haPaymentID: number;
  description: string;
  receiver: string;
  sender: string;
  scanned: boolean;
}
