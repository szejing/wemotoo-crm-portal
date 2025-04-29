import { z } from 'zod';

export const FilterPaymentTypeValidation = z.object({
	code: z.string().optional(),
	desc: z.string().optional(),
	short_desc: z.string().optional(),
});
