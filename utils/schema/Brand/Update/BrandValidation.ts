import { z } from 'zod';

export const UpdateBrandValidation = z.object({
	code: z.string().max(16),
	description: z.string(),
	is_active: z.boolean().default(true),
});
