import { z } from 'zod';

type TranslateFn = (key: string) => string;

export function UpdateTagValidation(t: TranslateFn) {
	return z.object({
		value: z.string({ message: t('validation.tag.valueRequired') }),
	});
}
