import { z } from 'zod';
import type { TranslateFn } from '../../Auth/LoginValidation';

function AddressValidation(t: TranslateFn) {
	return z
		.object({
			address1: z.string({ message: t('validation.outlet.address1Required') }).min(1),
			address2: z.string().nullable(),
			address3: z.string().nullable(),
			city: z.string({ message: t('validation.outlet.cityRequired') }).min(1),
			postal_code: z.string({ message: t('validation.outlet.postalCodeRequired') }).min(1),
			state: z.string({ message: t('validation.outlet.stateRequired') }).min(1),
			country_code: z.string({ message: t('validation.outlet.countryCodeRequired') }).min(1),
		})
		.partial();
}

export function UpdateOrderCustomerValidation(t: TranslateFn) {
	const Address = AddressValidation(t);
	return z.object({
		customer_no: z.string(),
		name: z.string({ message: t('validation.order.customerNameRequired') }).min(1),
		email_address: z.string().email(t('validation.order.emailInvalid')),
		phone_no: z.string({ message: t('validation.order.phoneNoRequired') }).min(1),
		ic_no: z.string().optional().nullable(),
		date_of_birth: z.date().optional().nullable(),
		ref_no1: z.string().optional().nullable(),
		ref_no2: z.string().optional().nullable(),
		shipping_address: Address,
		billing_address: Address,
	});
}
