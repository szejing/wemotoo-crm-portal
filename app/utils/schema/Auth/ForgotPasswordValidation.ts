import { z } from 'zod';

export const ForgotPasswordValidation = z.object({
	merchant_id: z.string({ message: 'Merchant Id is required.' }).min(5, { message: 'Invalid Merchant Id.' }),
	email_address: z.string({ message: 'Email is required.' }).email({ message: 'Email must be valid.' }),
});
