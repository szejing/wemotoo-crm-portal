import { z } from 'zod';
import type { TranslateFn } from '../../Auth/LoginValidation';

export function CreateOutletValidation(t: TranslateFn) {
	return z.object({
		code: z.string({ message: t('validation.outlet.outletCodeRequired') }),
		description: z.string({ message: t('validation.outlet.descriptionRequired') }),
		address1: z.string({ message: t('validation.outlet.address1Required') }),
		address2: z.string().optional(),
		address3: z.string().optional(),
		city: z.string({ message: t('validation.outlet.cityRequired') }),
		country_code: z.string({ message: t('validation.outlet.countryCodeRequired') }),
		state: z.string({ message: t('validation.outlet.stateRequired') }),
		postal_code: z.string({ message: t('validation.outlet.postalCodeRequired') }),
		longitude: z.number().optional().nullable(),
		latitude: z.number().optional().nullable(),
		tax_rule: z.string().optional().nullable(),
	});
}
