import { z } from 'zod';

export const CreateTaxValidation = z.object({
	code: z.string().min(1),
	description: z.string(),
	is_inclusive: z.boolean(),
	is_active: z.boolean().default(true),
	metadata: z.record(z.unknown()).optional(),
});
