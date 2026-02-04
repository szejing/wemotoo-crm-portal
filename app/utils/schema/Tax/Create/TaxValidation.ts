import { z } from 'zod';
import type { TranslateFn } from '../../Auth/LoginValidation';

export function CreateTaxValidation(t: TranslateFn) {
	return z.object({
		code: z.string({ message: t('validation.tax.taxCodeRequired') }).min(1),
		description: z.string({ message: t('validation.tax.taxDescriptionRequired') }),
		is_inclusive: z.boolean().default(false),
		is_active: z.boolean().default(true),
		metadata: z.record(z.string(), z.unknown()).optional(),
	});
}
