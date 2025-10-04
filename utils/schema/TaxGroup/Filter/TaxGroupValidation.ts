import { z } from 'zod';

export const FilterTaxGroupValidation = z.object({
	description: z.string().optional(),
});
