import { z } from 'zod';

type TranslateFn = (key: string) => string;

const optionalNonNegativeInt = z.preprocess((v) => {
	if (v === undefined || v === null || v === '') {
		return undefined;
	}
	if (typeof v === 'number' && Number.isNaN(v)) {
		return undefined;
	}
	return v;
}, z.number().int().nonnegative().optional());

const methodPricingRow = z.object({
	fee: z.coerce.number().nonnegative(),
	estimated_days: optionalNonNegativeInt,
});

export function CreateShippingZoneValidation(t: TranslateFn) {
	return z
		.object({
			code: z.string().trim().min(1, t('validation.shippingZone.codeRequired')).max(32, t('validation.shippingZone.codeMax32')),
			description: z.string().trim().optional().default(''),
			rule: z.coerce.number().int().min(0).max(999_999).default(0),
			is_active: z.boolean(),
			country_code: z
				.string()
				.trim()
				.transform((s) => (s.length === 0 ? 'MY' : s.toUpperCase()))
				.pipe(z.string().length(2, t('validation.shippingZone.countryInvalid'))),
			state: z.preprocess(
				(v) => (Array.isArray(v) ? v : []),
				z
					.array(z.string())
					.transform((arr) => arr.map((s) => s.trim()).filter(Boolean))
					.pipe(z.array(z.string()).min(1, t('validation.shippingZone.stateRequired'))),
			),
			postcodes_text: z.string().default(''),
			shipping_method_ids: z.array(z.string()).min(1, t('validation.shippingZone.methodsRequired')),
			method_pricing: z.record(z.string(), methodPricingRow),
		})
		.superRefine((val, ctx) => {
			for (const id of val.shipping_method_ids) {
				const row = val.method_pricing[id];
				if (!row) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: t('validation.shippingZone.methodsRequired'),
						path: ['method_pricing', id],
					});
				}
			}
		});
}

export function UpdateShippingZoneValidation(t: TranslateFn) {
	return CreateShippingZoneValidation(t);
}
