import { z } from 'zod';

const Category = z.object({ code: z.string().optional(), name: z.string().optional() });

export const CreateCategoryValidation = z.object({
	code: z.string().max(16),
	name: z.string(),
	description: z.string().optional(),
	is_active: z.boolean().default(true),
	is_internal: z.boolean().default(false),
	parent_category: Category.optional().nullable(),
});
