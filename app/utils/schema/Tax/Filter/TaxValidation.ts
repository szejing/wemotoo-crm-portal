import { z } from 'zod';

export const FilterTaxValidation = z.object({
	code: z.string().optional(),
	description: z.string().optional(),
	is_inclusive: z.boolean().optional(),
	is_active: z.boolean().optional(),
});
