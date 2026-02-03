import { z } from 'zod';
import type { TranslateFn } from '../../Auth/LoginValidation';

export function createUpdateTaxGroupValidation(t: TranslateFn) {
	return z.object({
		description: z.string({ message: t('validation.tax.taxGroupDescriptionRequired') }),
		taxes: z.array(z.object({ code: z.string() })).optional(),
	});
}

/** @deprecated Use createUpdateTaxGroupValidation(t) for i18n. */
export const UpdateTaxGroupValidation = z.object({
	description: z.string({ message: 'Tax group description is required' }),
	taxes: z.array(z.object({ code: z.string() })).optional(),
});
