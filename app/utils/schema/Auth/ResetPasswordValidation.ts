import { z } from 'zod';

export const MIN_PASSWORD_LENGTH = 8;

export type TranslateFn = (key: string, params?: Record<string, unknown>) => string;

export function createResetPasswordValidation(t: TranslateFn) {
	return z
		.object({
			password: z
				.string({ message: t('validation.auth.passwordRequiredDot') })
				.min(MIN_PASSWORD_LENGTH, { message: t('validation.auth.passwordMinLength', { n: MIN_PASSWORD_LENGTH }) }),
			confirmPassword: z.string({ message: t('validation.auth.confirmPasswordRequired') }),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: t('validation.auth.passwordsDoNotMatch'),
			path: ['confirmPassword'],
		});
}

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
