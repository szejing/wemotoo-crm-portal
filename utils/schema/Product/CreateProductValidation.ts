import { z } from 'zod';

export const CreateProductValidation = z.object({
	code: z.string().max(10),
	name: z.string(),
	description: z.string().optional(),
	// tag: z.string().optional(),
});
