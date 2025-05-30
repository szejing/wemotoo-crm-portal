import { z } from 'zod';

const Category = z.object({ code: z.string().optional(), name: z.string().optional() });

export const UpdateCategoryValidation = z.object({
	code: z.string().max(16),
	description: z.string(),
	is_active: z.boolean().default(true),
	is_internal: z.boolean().default(false).nullable(),
	parent_category: Category.optional().nullable(),
});
