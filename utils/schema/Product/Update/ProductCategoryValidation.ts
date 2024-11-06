import { z } from 'zod';

export const UpdateProductCategoryValidation = z.object({
	id: z.string().max(10),
	name: z.string(),
	description: z.string().optional().nullable(),
	is_active: z.boolean().default(true),
	is_internal: z.boolean().default(false).nullable(),
	images: z.array(z.string()).optional().nullable(),
	thumbnail: z.string().optional().nullable(),
	parent_category: z.string().optional().nullable(),
});
