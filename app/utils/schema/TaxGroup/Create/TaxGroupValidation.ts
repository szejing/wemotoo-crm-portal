import { z } from 'zod';
import type { TranslateFn } from '../../Auth/LoginValidation';

export function createCreateTaxGroupValidation(t: TranslateFn) {
	return z.object({
		code: z.string({ message: t('validation.tax.taxGroupCodeRequired') }),
		description: z.string({ message: t('validation.tax.taxGroupDescriptionRequired') }),
		taxes: z.array(z.object({ code: z.string() })).optional(),
	});
}

/** @deprecated Use createCreateTaxGroupValidation(t) for i18n. */
export const CreateTaxGroupValidation = z.object({
	code: z.string({ message: 'Tax group code is required' }),
	description: z.string({ message: 'Tax group description is required' }),
	taxes: z.array(z.object({ code: z.string() })).optional(),
});
