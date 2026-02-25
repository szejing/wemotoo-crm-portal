import { z } from 'zod';
import { TaxDetailValidation } from '../Create/TaxRuleValidation';

type TranslateFn = (key: string) => string;

export function UpdateTaxRuleValidation(t: TranslateFn) {
	const DetailSchema = TaxDetailValidation(t);
	return z.object({
		description: z.string({ message: t('validation.tax.taxRuleDescriptionRequired') }),
		details: z.array(DetailSchema),
	});
}
