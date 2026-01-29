import { z } from 'zod';

export const FilterPaymentTypeGroupValidation = z.object({
	code: z.string().optional(),
	desc: z.string().optional(),
	short_desc: z.string().optional(),
});
