import { z } from 'zod';

export const FilterBrandValidation = z.object({
	code: z.string().optional(),
	description: z.string().optional(),
});
