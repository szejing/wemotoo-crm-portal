import { z } from 'zod';

export const CreateProductCategoryValidation = z.object({
	id: z.string().max(6),
	name: z.string(),
	description: z.string().optional(),
	is_active: z.boolean().default(true),
	is_internal: z.boolean().default(false),
	images: z.array(z.string()).optional(),
	thumbnail: z.string().optional(),
	parent_category: z.string().optional(),
});
