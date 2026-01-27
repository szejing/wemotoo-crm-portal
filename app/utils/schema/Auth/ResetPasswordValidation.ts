import { z } from 'zod';

const MIN_PASSWORD_LENGTH = 8;

export const ResetPasswordValidation = z
	.object({
		password: z
			.string({ message: 'Password is required.' })
			.min(MIN_PASSWORD_LENGTH, { message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` }),
		confirmPassword: z.string({ message: 'Please confirm your password.' }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match.',
		path: ['confirmPassword'],
	});
