import { z } from 'zod';

export const FilterTagValidation = z.object({
	name: z.string().optional(),
});
