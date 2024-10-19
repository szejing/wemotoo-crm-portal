import { z } from 'zod';

export const CreateProductCategoryValidation = z.object({
	name: z.string(),
	code: z.string().max(10),
	description: z.string().optional(),
	images: z.array(z.string()).optional(),
	thumbnail: z.string().optional(),
	parent_category: z.string().optional(),
});
