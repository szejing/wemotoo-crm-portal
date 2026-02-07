import { z } from 'zod';

type TranslateFn = (key: string) => string;
const Category = z.object({ code: z.string().optional(), name: z.string().optional() });

export function CreateCategoryValidation(t: TranslateFn) {
	return z.object({
		code: z.string().min(1, t('validation.category.codeRequired')).max(16, t('validation.product.codeMax16')),
		description: z.string({ message: t('validation.category.descriptionRequired') }),
		is_active: z.boolean().default(true),
		is_internal: z.boolean().default(false),
		parent_category: Category.optional().nullable(),
	});
}
