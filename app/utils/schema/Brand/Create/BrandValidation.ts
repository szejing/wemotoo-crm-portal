import { z } from 'zod';
import type { TranslateFn } from '../../Auth/LoginValidation';

export function createCreateBrandValidation(t: TranslateFn) {
	return z.object({
		code: z.string().min(1, t('validation.brand.codeRequired')).max(16, t('validation.product.codeMax16')),
		description: z.string({ message: t('validation.brand.descriptionRequired') }),
		is_active: z.boolean().default(true),
	});
}

/** @deprecated Use createCreateBrandValidation(t) for i18n. */
export const CreateBrandValidation = z.object({
	code: z.string().min(1, 'Code is required').max(16, 'Max. 16 characters'),
	description: z.string({ message: 'Description is required' }),
	is_active: z.boolean().default(true),
});
