import { z } from 'zod';
import type { TranslateFn } from '../../Auth/LoginValidation';

export function createUpdateTagValidation(t: TranslateFn) {
	return z.object({
		value: z.string({ message: t('validation.tag.valueRequired') }),
	});
}

/** @deprecated Use createUpdateTagValidation(t) for i18n. */
export const UpdateTagValidation = z.object({
	value: z.string({ message: 'Tag is required' }),
});
