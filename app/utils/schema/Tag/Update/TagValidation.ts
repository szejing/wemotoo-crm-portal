import { z } from 'zod';
import type { TranslateFn } from '../../Auth/LoginValidation';

export function UpdateTagValidation(t: TranslateFn) {
	return z.object({
		value: z.string({ message: t('validation.tag.valueRequired') }),
	});
}
