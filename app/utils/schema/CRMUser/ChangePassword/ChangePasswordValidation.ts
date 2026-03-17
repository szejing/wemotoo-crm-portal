import { z } from 'zod';

export const MIN_PASSWORD_LENGTH = 8;

type TranslateFn = (key: string, params?: Record<string, unknown>) => string;

/** Schema when current password is required (user changing own password). */
export function ChangePasswordValidation(t: TranslateFn) {
	return changePasswordSchema(t, true);
}

/** Schema for admin reset (no current password). */
export function AdminResetPasswordValidation(t: TranslateFn) {
	return changePasswordSchema(t, false);
}

function changePasswordSchema(t: TranslateFn, requireOld: boolean) {
	return z
		.object({
			old_password: requireOld
				? z.string({ message: t('validation.changePassword.currentPasswordRequired') }).min(1, {
						message: t('validation.changePassword.currentPasswordRequired'),
					})
				: z.string().optional(),
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
