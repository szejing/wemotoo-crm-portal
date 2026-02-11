import { z } from 'zod';

type TranslateFn = (key: string) => string;

export const TaxFilterValidation = z.object({
	id: z.number().optional(),
	filter_operator: z.string().optional(),
	filter_type: z.string().optional(),
	filter_condition: z.string().optional(),
	filter_value: z.string().optional(),
});

export const TaxConditionValidation = z.object({
	id: z.number().optional(),
	tax_code: z.string().optional(),
	starts_at: z.date().optional(),
	ends_at: z.date().optional(),
	amount_type: z.string().optional(),
	rate: z.number().optional(),
	min_amount: z.number().nullable().optional(),
	max_amount: z.number().nullable().optional(),
	filters: z.array(TaxFilterValidation).optional(),
});

export function TaxDetailValidation(t: TranslateFn) {
	return z.object({
		id: z.number().optional(),
		description: z.string({ message: t('validation.tax.taxRuleDescriptionRequired') }),
		tax_code: z.string().optional(),
		tax_condition: TaxConditionValidation.optional(),
	});
}

export function CreateTaxRuleValidation(t: TranslateFn) {
	const DetailSchema = TaxDetailValidation(t);
	return z.object({
		code: z.string({ message: t('validation.tax.taxRuleCodeRequired') }),
		description: z.string({ message: t('validation.tax.taxRuleDescriptionRequired') }),
		details: z.array(DetailSchema),
	});
}
