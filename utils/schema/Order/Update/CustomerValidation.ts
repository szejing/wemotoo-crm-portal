import { z } from 'zod';

const AddressValidation = z
	.object({
		address1: z.string().min(1, 'Address 1 is required'),
		address2: z.string().nullable(),
		address3: z.string().nullable(),
		city: z.string().min(1, 'City is required'),
		postal_code: z.string().min(1, 'Postal code is required'),
		state: z.string().min(1, 'State is required'),
		country_code: z.string().min(1, 'Country code is required'),
	})
	.partial();

export const UpdateOrderCustomerValidation = z.object({
	customer_no: z.string(),
	name: z.string().min(1, 'Customer name is required'),
	email_address: z.string().email('Invalid email address'),
	phone_no: z.string().min(1, 'Phone number is required'),
	ic_no: z.string().optional().nullable(),
	date_of_birth: z.date().optional().nullable(),
	ref_no1: z.string().optional().nullable(),
	ref_no2: z.string().optional().nullable(),
	shipping_address: AddressValidation,
	billing_address: AddressValidation,
});
