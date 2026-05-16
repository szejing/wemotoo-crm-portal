import { z } from 'zod';

type TranslateFn = (key: string) => string;

export function CreateCourierValidation(t: TranslateFn) {
	return z.object({
		name: z.string().trim().min(1, t('validation.courier.nameRequired')).max(191, t('validation.courier.nameMax')),
		description: z.string().trim().optional().or(z.literal('')),
		is_active: z.boolean(),
	});
}

export function UpdateCourierFormValidation(t: TranslateFn) {
	return CreateCourierValidation(t);
}
