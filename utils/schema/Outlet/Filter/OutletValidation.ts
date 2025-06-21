import { z } from 'zod';

export const FilterOutletValidation = z.object({
	code: z.string().optional(),
	description: z.string().optional(),
	city: z.string().optional(),
	country_code: z.string().optional(),
	state: z.string().optional(),
	postal_code: z.string().optional(),
});
