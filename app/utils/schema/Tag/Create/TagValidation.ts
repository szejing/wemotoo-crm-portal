import { z } from 'zod';

type TranslateFn = (key: string) => string;

export function CreateTagValidation(t: TranslateFn) {
	return z.object({
		value: z.string({ message: t('validation.tag.valueRequired') }),
		metadata: z.record(z.string(), z.unknown()).optional(),
	});
}
