import { z } from 'zod';

export const CreateProductValidation = z.object({
	code: z.string().max(10),
	title: z.string(),
	subtitle: z.string(),
	description: z.string().optional(),
	isActive: z.boolean().default(true),
	isService: z.boolean().default(false),
});
