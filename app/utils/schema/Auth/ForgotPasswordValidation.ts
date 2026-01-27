import { z } from 'zod';

export const ForgotPasswordValidation = z.object({
	email: z.string({ message: 'Email is required.' }).email({ message: 'Please enter a valid email address.' }),
});
