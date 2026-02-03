import { z } from 'zod';
import type { TranslateFn } from '../../Auth/LoginValidation';

export function createUpdateBrandValidation(t: TranslateFn) {
	return z.object({
		code: z.string({ message: t('validation.brand.codeRequired') }).max(16, t('validation.product.codeMax16')),
		description: z.string({ message: t('validation.brand.descriptionRequired') }),
		is_active: z.boolean().default(true),
	});
}

/** @deprecated Use createUpdateBrandValidation(t) for i18n. */
export const UpdateBrandValidation = z.object({
	code: z.string({ message: 'Code is required' }).max(16, 'Max. 16 characters'),
	description: z.string({ message: 'Description is required' }),
	is_active: z.boolean().default(true),
});
