import { z } from 'zod';

type TranslateFn = (key: string) => string;
export function UpdateOutletValidation(t: TranslateFn) {
	return z.object({
		description: z.string({ message: t('validation.outlet.descriptionRequired') }),
		address1: z.string({ message: t('validation.outlet.address1Required') }),
		address2: z.string().optional().nullable(),
		address3: z.string().optional().nullable(),
		city: z.string({ message: t('validation.outlet.cityRequired') }),
		country_code: z.string({ message: t('validation.outlet.countryCodeRequired') }),
		state: z.string({ message: t('validation.outlet.stateRequired') }),
		postal_code: z.string({ message: t('validation.outlet.postalCodeRequired') }),
		longitude: z
			.union([
				z.literal(''),
				z.null(),
				z.number(),
				z.string().refine((val) => !Number.isNaN(Number(val)), {
					message: t('validation.outlet.longitudeMustBeNumeric'),
				}),
			])
			.optional()
			.nullable(),
		latitude: z
			.union([
				z.literal(''),
				z.null(),
				z.number(),
				z.string().refine((val) => !Number.isNaN(Number(val)), {
					message: t('validation.outlet.latitudeMustBeNumeric'),
				}),
			])
			.optional()
			.nullable(),
		tax_rule: z.string().optional().nullable(),
	});
}
