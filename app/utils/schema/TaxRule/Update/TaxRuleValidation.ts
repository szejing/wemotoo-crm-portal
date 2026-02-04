import { z } from 'zod';
import type { TranslateFn } from '../../Auth/LoginValidation';
import { TaxDetailValidation } from '../Create/TaxRuleValidation';

export function UpdateTaxRuleValidation(t: TranslateFn) {
	const DetailSchema = TaxDetailValidation(t);
	return z.object({
		description: z.string({ message: t('validation.tax.taxRuleDescriptionRequired') }),
		details: z.array(DetailSchema),
	});
}
