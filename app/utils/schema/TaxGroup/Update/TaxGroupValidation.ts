import { z } from 'zod';
import type { TranslateFn } from '../../Auth/LoginValidation';

export function UpdateTaxGroupValidation(t: TranslateFn) {
	return z.object({
		description: z.string({ message: t('validation.tax.taxGroupDescriptionRequired') }),
		taxes: z.array(z.object({ code: z.string() })).optional(),
	});
}
