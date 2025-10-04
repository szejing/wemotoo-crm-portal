import { z } from 'zod';

export const CreateTaxValidation = z.object({
	code: z.string({ message: 'Tax code is required' }).min(1),
	description: z.string({ message: 'Tax description is required' }),
	is_inclusive: z.boolean().default(false),
	is_active: z.boolean().default(true),
	metadata: z.record(z.string(), z.unknown()).optional(),
});
