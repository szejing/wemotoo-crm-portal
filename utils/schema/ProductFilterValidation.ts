import { z } from 'zod';

export const ProductFilterValidation = z.object({
	code: z.string().optional(),
	name: z.string().optional(),
	description: z.string().optional(),
	tag: z.string().optional(),
});
