import { z } from 'zod';

export const CreateCategoryValidation = z.object({
	code: z.string().max(16),
	name: z.string(),
	description: z.string().optional(),
	is_active: z.boolean().default(true),
	is_internal: z.boolean().default(false),
	images: z.array(z.string()).optional(),
	thumbnail: z.string().optional(),
	parent_category: z.string().optional(),
});
