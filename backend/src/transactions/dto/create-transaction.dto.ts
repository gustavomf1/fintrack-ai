import { z } from 'zod';

export type CreateTransactionDto = z.infer<typeof createTransactionSchema>;

export const createTransactionSchema = z.object({
  amount: z.number().positive(),
  date: z.coerce.date(),
  description: z.string().min(1),
  category: z.enum(['food', 'transport', 'subscription', 'other']),
});

