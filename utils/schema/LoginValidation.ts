import { z } from 'zod';

export const LoginValidation = z.object({
	email: z.string({ message: 'Email is required.' }).email({ message: 'Email must be valid.' }),
	password: z
		.string({ message: 'Password is required' })
		.min(6, { message: 'Password must be at least 6 characters' })
		.regex(/^[a-zA-Z0-9]+$/, { message: 'Password must contain only alphanumeric characters' }),
});
