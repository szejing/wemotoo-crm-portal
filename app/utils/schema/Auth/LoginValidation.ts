import { z } from 'zod';

export const LoginValidation = z.object({
	merchant_id: z.string({ message: 'Merchant Id is required.' }).min(5, { message: 'Invalid Merchant Id.' }),
	email_address: z.string({ message: 'Email is required.' }).email({ message: 'Email must be valid.' }),
	password: z.string({ message: 'Password is required' }).min(6, { message: 'Password must be at least 6 characters' }),
	// .regex(/^[a-zA-Z0-9!@#$%^&*()_+={}[\]:;"'<>,.?~`-]+$/, { message: 'Password must contain alphanumeric characters and special characters' }),
});
