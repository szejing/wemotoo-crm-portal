import { z } from 'zod';

export const CreateTaxGroupValidation = z.object({
	code: z.string({ message: 'Tax group code is required' }),
	description: z.string({ message: 'Tax group description is required' }),
	taxes: z.array(z.object({ code: z.string() })).optional(),
});
