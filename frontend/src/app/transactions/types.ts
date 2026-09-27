import type { Category } from "./categories";

export type Transaction = {
  id: string;
  amount: number;
  date: string;
  description: string;
  category: Category;
};
