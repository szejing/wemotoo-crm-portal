import { z } from 'zod';

export const FilterCategoryValidation = z.object({
	code: z.string().optional(),
	description: z.string().optional(),
});
