import { z } from 'zod';

export const envSchema = z.object({
	JWT_SECRET: z.string({ error: 'JWT_SECRET is required string' }),
	JWT_EXPIRES_IN_MS: z.coerce.number({ error: 'JWT_EXPIRES_IN is required number' }),
	SALT_ROUNDS: z.coerce.number({ error: 'SALT_ROUNDS is required number' }).default(10),
});

export type Env = z.infer<typeof envSchema>;
