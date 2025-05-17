export interface Order {
  id: number;
  amount: number;
  date: Date;
  status: string;
  haOrderID: number;
  description: string;
  receiver: string;
  sender: string;
}
