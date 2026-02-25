import { z } from 'zod';

type TranslateFn = (key: string) => string;

export function CreateTaxGroupValidation(t: TranslateFn) {
	return z.object({
		code: z.string({ message: t('validation.tax.taxGroupCodeRequired') }),
		description: z.string({ message: t('validation.tax.taxGroupDescriptionRequired') }),
		taxes: z.array(z.object({ code: z.string() })).optional(),
	});
}
