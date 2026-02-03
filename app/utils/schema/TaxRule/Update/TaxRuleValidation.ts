import { z } from 'zod';
import type { TranslateFn } from '../../Auth/LoginValidation';
import { createTaxDetailValidation } from '../Create/TaxRuleValidation';

export function createUpdateTaxRuleValidation(t: TranslateFn) {
	const TaxDetailValidation = createTaxDetailValidation(t);
	return z.object({
		description: z.string({ message: t('validation.tax.taxRuleDescriptionRequired') }),
		details: z.array(TaxDetailValidation),
	});
}

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
	description: z.string({ message: 'Tax rule description is required' }),
	tax_code: z.string().optional(),
	tax_condition: TaxConditionValidation.optional(),
});

/** @deprecated Use createUpdateTaxRuleValidation(t) for i18n. */
export const UpdateTaxRuleValidation = z.object({
	description: z.string({ message: 'Tax rule description is required' }),
	details: z.array(TaxDetailValidation),
});
