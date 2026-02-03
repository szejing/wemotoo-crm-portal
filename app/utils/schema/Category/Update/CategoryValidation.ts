import { z } from 'zod';
import type { TranslateFn } from '../../Auth/LoginValidation';

const Category = z.object({ code: z.string().optional(), name: z.string().optional() });

export function createUpdateCategoryValidation(t: TranslateFn) {
	return z.object({
		code: z.string({ message: t('validation.category.codeRequired') }).max(16, t('validation.product.codeMax16')),
		description: z.string({ message: t('validation.category.descriptionRequired') }),
		is_active: z.boolean().default(true),
		is_internal: z.boolean().default(false).nullable(),
		parent_category: Category.optional().nullable(),
	});
}

/** @deprecated Use createUpdateCategoryValidation(t) for i18n. */
export const UpdateCategoryValidation = z.object({
	code: z.string({ message: 'Code is required' }).max(16, 'Max. 16 characters'),
	description: z.string({ message: 'Description is required' }),
	is_active: z.boolean().default(true),
	is_internal: z.boolean().default(false).nullable(),
	parent_category: Category.optional().nullable(),
});
