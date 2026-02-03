import { z } from 'zod';
import type { TranslateFn } from '../../Auth/LoginValidation';

export function CreateTaxGroupValidation(t: TranslateFn) {
	return z.object({
		code: z.string({ message: t('validation.tax.taxGroupCodeRequired') }),
		description: z.string({ message: t('validation.tax.taxGroupDescriptionRequired') }),
		taxes: z.array(z.object({ code: z.string() })).optional(),
	});
}
