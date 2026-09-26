export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  date: Date;
  description: string;
  category: 'food' | 'transport' | 'subscription' | 'other'
}