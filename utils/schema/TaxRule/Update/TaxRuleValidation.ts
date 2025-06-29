import { z } from 'zod';

const TaxFilterValidation = z.object({
	filter_operator: z.string(),
	filter_condition: z.string(),
	filter_value: z.string(),
});

const TaxConditionValidation = z.object({
	id: z.number().optional(),
	starts_at: z.date().optional().nullable(),
	ends_at: z.date().optional().nullable(),
	amount_type: z.string().optional(),
	rate: z.number().optional(),
	min_amount: z.number().optional().nullable(),
	max_amount: z.number().optional().nullable(),
	filters: z.array(TaxFilterValidation).optional(),
});

const TaxDetailValidation = z.object({
	id: z.number().optional(),
	description: z.string(),
	tax_code: z.string().optional(),
	tax_condition: TaxConditionValidation.optional(),
});

export const UpdateTaxRuleValidation = z.object({
	description: z.string(),
	details: z.array(TaxDetailValidation),
});
