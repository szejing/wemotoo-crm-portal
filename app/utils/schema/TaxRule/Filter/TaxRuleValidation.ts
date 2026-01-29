import { z } from 'zod';

export const FilterTaxRuleValidation = z.object({
	name: z.string().optional(),
});
