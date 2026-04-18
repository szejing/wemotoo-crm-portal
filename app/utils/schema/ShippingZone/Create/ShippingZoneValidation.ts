import { z } from 'zod';

type TranslateFn = (key: string) => string;

const optionalNonNegativeNumber = z.preprocess((v) => {
	if (v === undefined || v === null || v === '') {
		return undefined;
	}
	if (typeof v === 'number' && Number.isNaN(v)) {
		return undefined;
	}
	return v;
}, z.number().nonnegative().optional());

const optionalNonNegativeInt = z.preprocess((v) => {
	if (v === undefined || v === null || v === '') {
		return undefined;
	}
	if (typeof v === 'number' && Number.isNaN(v)) {
		return undefined;
	}
	return v;
}, z.number().int().nonnegative().optional());

export function CreateShippingZoneValidation(t: TranslateFn) {
	return z.object({
		name: z.string().trim().min(1, t('validation.shippingZone.nameRequired')),
		is_active: z.boolean(),
		country_code: z
			.string()
			.trim()
			.length(2, t('validation.shippingZone.countryInvalid'))
			.transform((s) => s.toUpperCase()),
		state: z.string().trim().optional().default(''),
		postcodes_text: z.string().default(''),
		fee_override: optionalNonNegativeNumber,
		estimated_days_override: optionalNonNegativeInt,
		shipping_method_ids: z.array(z.string()).min(1, t('validation.shippingZone.methodsRequired')),
	});
}

export function UpdateShippingZoneValidation(t: TranslateFn) {
	return CreateShippingZoneValidation(t);
}
