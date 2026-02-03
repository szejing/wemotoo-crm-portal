import { z } from 'zod';
import type { TranslateFn } from '../../Auth/LoginValidation';

export function createUpdateOutletValidation(t: TranslateFn) {
	return z.object({
		description: z.string({ message: t('validation.outlet.descriptionRequired') }),
		address1: z.string({ message: t('validation.outlet.address1Required') }),
		address2: z.string().optional().nullable(),
		address3: z.string().optional().nullable(),
		city: z.string({ message: t('validation.outlet.cityRequired') }),
		country_code: z.string({ message: t('validation.outlet.countryCodeRequired') }),
		state: z.string({ message: t('validation.outlet.stateRequired') }),
		postal_code: z.string({ message: t('validation.outlet.postalCodeRequired') }),
		longitude: z.number().optional().nullable(),
		latitude: z.number().optional().nullable(),
		tax_rule: z.string().optional().nullable(),
	});
}

/** @deprecated Use createUpdateOutletValidation(t) for i18n. */
export const UpdateOutletValidation = z.object({
	description: z.string({ message: 'Description is required' }),
	address1: z.string({ message: 'Address 1 is required' }),
	address2: z.string().optional().nullable(),
	address3: z.string().optional().nullable(),
	city: z.string({ message: 'City is required' }),
	country_code: z.string({ message: 'Country code is required' }),
	state: z.string({ message: 'State is required' }),
	postal_code: z.string({ message: 'Postal code is required' }),
	longitude: z.number().optional().nullable(),
	latitude: z.number().optional().nullable(),
	tax_rule: z.string().optional().nullable(),
});
