import { z } from 'zod';

export const MIN_PASSWORD_LENGTH = 8;

type TranslateFn = (key: string, params?: Record<string, unknown>) => string;

export function ChangePasswordValidation(t: TranslateFn) {
	return z
		.object({
			old_password: z.string({ message: t('validation.changePassword.currentPasswordRequired') }).min(1, {
				message: t('validation.changePassword.currentPasswordRequired'),
			}),
			new_password: z
				.string({ message: t('validation.changePassword.newPasswordRequired') })
				.min(MIN_PASSWORD_LENGTH, { message: t('validation.changePassword.newPasswordMinLength', { n: MIN_PASSWORD_LENGTH }) })
				.regex(/\d/, { message: t('validation.changePassword.newPasswordRequiresNumber') })
				.regex(/[a-z]/, { message: t('validation.changePassword.newPasswordRequiresLowercase') })
				.regex(/[A-Z]/, { message: t('validation.changePassword.newPasswordRequiresUppercase') }),
			confirm_password: z.string({ message: t('validation.changePassword.confirmPasswordRequired') }),
		})
		.refine((data) => data.new_password === data.confirm_password, {
			message: t('validation.changePassword.passwordConfirmationMismatch'),
			path: ['confirm_password'],
		});
}
