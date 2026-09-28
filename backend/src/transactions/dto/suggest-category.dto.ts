import { z } from 'zod';

export type SuggestCategoryDto = z.infer<typeof suggestCategorySchema>;

export const suggestCategorySchema = z.object({
  description: z.string().min(1),
});
