import { z } from 'zod';

export const UpdateTaxValidation = z.object({
	description: z.string(),
	is_inclusive: z.boolean(),
	is_active: z.boolean().default(true),
	metadata: z.record(z.unknown()).optional(),
});
