import { z } from 'zod';

export const FilterOptionValidation = z.object({
	name: z.string().optional(),
	value: z.string().optional(),
});
