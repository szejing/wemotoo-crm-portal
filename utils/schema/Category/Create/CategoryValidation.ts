import { z } from 'zod';

const Category = z.object({ code: z.string().optional(), name: z.string().optional() });

export const CreateCategoryValidation = z.object({
	code: z.string().min(1, 'Code is required').max(16, 'Max. 16 characters'),
	description: z.string({ message: 'Description is required' }),
	is_active: z.boolean().default(true),
	is_internal: z.boolean().default(false),
	parent_category: Category.optional().nullable(),
});
