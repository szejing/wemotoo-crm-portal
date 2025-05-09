import { z } from 'zod';

const AddressValidation = z.object({
	address1: z.string(),
	address2: z.string().optional(),
	address3: z.string().optional(),
	city: z.string(),
	postal_code: z.string().max(6),
	country_code: z.string(),
	state_name: z.string(),
});

export const FilterCustomerValidation = z.object({
	name: z.string(),
	email_address: z.string(),
	phone_no: z.string(),
	shipping_address: AddressValidation.required(),
	billing_address: AddressValidation.required(),
});
