import { z } from 'zod';

export const UpdateTaxGroupValidation = z.object({
	description: z.string(),
	taxes: z.array(z.object({ code: z.string() })).optional(),
});
