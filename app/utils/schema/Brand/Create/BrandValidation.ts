import { z } from 'zod';
import type { TranslateFn } from '../../Auth/LoginValidation';

export function CreateBrandValidation(t: TranslateFn) {
	return z.object({
		code: z.string().min(1, t('validation.brand.codeRequired')).max(16, t('validation.product.codeMax16')),
		description: z.string({ message: t('validation.brand.descriptionRequired') }),
		is_active: z.boolean().default(true),
	});
}
