import { z } from 'zod';

type TranslateFn = (key: string) => string;

export function CreateShippingMethodValidation(t: TranslateFn) {
	return z.object({
		description: z.string().trim().min(1, t('validation.shippingMethod.descriptionRequired')),
		priority: z.coerce.number().int().min(0, t('validation.shippingMethod.priorityMin')),
		is_active: z.boolean(),
	});
}

export function UpdateShippingMethodFormValidation(t: TranslateFn) {
	return CreateShippingMethodValidation(t);
}
