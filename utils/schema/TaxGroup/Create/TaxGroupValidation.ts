import { z } from 'zod';

export const CreateTaxGroupValidation = z.object({
	code: z.string(),
	description: z.string(),
	taxes: z.array(z.object({ code: z.string() })).optional(),
});
