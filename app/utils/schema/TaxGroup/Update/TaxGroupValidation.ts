import { z } from 'zod';

export const UpdateTaxGroupValidation = z.object({
	description: z.string({ message: 'Tax group description is required' }),
	taxes: z.array(z.object({ code: z.string() })).optional(),
});
