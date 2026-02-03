import { z } from 'zod';
import type { TranslateFn } from '../../Auth/LoginValidation';

export function createUpdateTaxValidation(t: TranslateFn) {
	return z.object({
		description: z.string({ message: t('validation.tax.taxDescriptionRequired') }),
		is_inclusive: z.boolean().default(false),
		is_active: z.boolean().default(true),
		metadata: z.record(z.string(), z.unknown()).optional(),
	});
}

/** @deprecated Use createUpdateTaxValidation(t) for i18n. */
export const UpdateTaxValidation = z.object({
	description: z.string({ message: 'Tax description is required' }),
	is_inclusive: z.boolean().default(false),
	is_active: z.boolean().default(true),
	metadata: z.record(z.string(), z.unknown()).optional(),
});
