import { z } from 'zod';

export const FilterPaymentMethodValidation = z.object({
	code: z.string().optional(),
	desc: z.string().optional(),
	short_desc: z.string().optional(),
});
