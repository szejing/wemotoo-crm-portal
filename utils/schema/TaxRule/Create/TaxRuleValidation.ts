import { z } from 'zod';

export const CreateTaxRuleValidation = z.object({
	value: z.string(),
	metadata: z.record(z.unknown()).optional(),
});
