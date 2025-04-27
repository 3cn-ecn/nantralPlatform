export interface Transaction {
  id: number;
  amount: number;
  date: Date;
  sender: string;
  receiver: string;
  description: string;
  status: string;
  type: string;
}
