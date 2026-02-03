import { z } from 'zod';
import type { TranslateFn } from '../../Auth/LoginValidation';

export const TaxFilterValidation = z.object({
	filter_operator: z.string(),
	filter_condition: z.string(),
	filter_value: z.string(),
});

export const TaxConditionValidation = z.object({
	id: z.number().optional(),
	tax_code: z.string().optional(),
	starts_at: z.date().optional(),
	ends_at: z.date().optional(),
	amount_type: z.string().optional(),
	rate: z.number().optional(),
	min_amount: z.number().optional(),
	max_amount: z.number().optional(),
	filters: z.array(TaxFilterValidation).optional(),
});

export function createTaxDetailValidation(t: TranslateFn) {
	return z.object({
		id: z.number().optional(),
		description: z.string({ message: t('validation.tax.taxRuleDescriptionRequired') }),
		tax_code: z.string().optional(),
		tax_condition: TaxConditionValidation.optional(),
	});
}

export function createCreateTaxRuleValidation(t: TranslateFn) {
	const TaxDetailValidation = createTaxDetailValidation(t);
	return z.object({
		code: z.string({ message: t('validation.tax.taxRuleCodeRequired') }),
		description: z.string({ message: t('validation.tax.taxRuleDescriptionRequired') }),
		details: z.array(TaxDetailValidation),
	});
}

/** @deprecated Use createCreateTaxRuleValidation(t) for i18n. */
export const TaxDetailValidation = z.object({
	id: z.number().optional(),
	description: z.string({ message: 'Tax rule description is required' }),
	tax_code: z.string().optional(),
	tax_condition: TaxConditionValidation.optional(),
});

/** @deprecated Use createCreateTaxRuleValidation(t) for i18n. */
export const CreateTaxRuleValidation = z.object({
	code: z.string({ message: 'Tax rule code is required' }),
	description: z.string({ message: 'Tax rule description is required' }),
	details: z.array(TaxDetailValidation),
});
