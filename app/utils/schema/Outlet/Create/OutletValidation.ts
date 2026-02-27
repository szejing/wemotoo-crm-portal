import { z } from 'zod';

type TranslateFn = (key: string) => string;
export function CreateOutletValidation(t: TranslateFn) {
	return z.object({
		code: z.string({ message: t('validation.outlet.outletCodeRequired') }),
		dial_code: z.string({ message: t('validation.outlet.dialCodeRequired') }),
		phone_no: z.string({ message: t('validation.outlet.phoneNoRequired') }),
		description: z.string({ message: t('validation.outlet.descriptionRequired') }),
		address1: z.string({ message: t('validation.outlet.address1Required') }),
		address2: z.string().optional(),
		address3: z.string().optional(),
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
