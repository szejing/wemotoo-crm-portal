import { z } from 'zod';

export const FilterCategoryValidation = z.object({
	code: z.string().optional(),
	name: z.string().optional(),
	description: z.string().optional(),
});
