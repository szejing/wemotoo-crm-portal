import { z } from 'zod';

export const UpdateTaxValidation = z.object({
	description: z.string({ message: 'Tax description is required' }),
	is_inclusive: z.boolean().default(false),
	is_active: z.boolean().default(true),
	metadata: z.record(z.string(), z.unknown()).optional(),
});
