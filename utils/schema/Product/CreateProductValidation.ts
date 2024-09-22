import { z } from 'zod';

export const CreateProductValidation = z.object({
	code: z.string().max(10),
	title: z.string(),
	subtitle: z.string(),
	description: z.string().optional(),
	is_active: z.boolean().default(true),
	is_service: z.boolean().default(false),
});
