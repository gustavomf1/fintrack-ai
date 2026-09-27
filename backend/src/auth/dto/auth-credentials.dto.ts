import { z } from 'zod';

export const authCredentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8),
});

export type AuthCredentialsDto = z.infer<typeof authCredentialsSchema>;
