import { z } from 'zod';

const AddressValidation = z.object({
	address1: z.string().min(1),
	address2: z.string().optional(),
	address3: z.string().optional(),
	city: z.string().min(1),
	postal_code: z.string().min(1),
	state: z.string().min(1),
	country_code: z.string().min(1),
});

export const UpdateCustomerValidation = z.object({
	email_address: z.string(),
	phone_no: z.string(),
	ic_no: z.string().optional(),
	date_of_birth: z.string().optional(),
	ref_no1: z.string().optional(),
	ref_no2: z.string().optional(),
	shipping_address: AddressValidation,
	billing_address: AddressValidation,
});
