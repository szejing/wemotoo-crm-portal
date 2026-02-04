import { z } from 'zod';
import type { TranslateFn } from '../../Auth/LoginValidation';

export function CreateTagValidation(t: TranslateFn) {
	return z.object({
		value: z.string({ message: t('validation.tag.valueRequired') }),
		metadata: z.record(z.string(), z.unknown()).optional(),
	});
}
