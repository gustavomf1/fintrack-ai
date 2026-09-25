export interface Transaction {
  id: string;
  amount: number;
  date: Date;
  description: string;
  category: 'food' | 'transport' | 'subscription' | 'other'
}