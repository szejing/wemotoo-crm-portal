import { z } from 'zod';

export type TranslateFn = (key: string) => string;

export function createLoginValidation(t: TranslateFn) {
	return z.object({
		merchant_id: z.string({ message: t('validation.auth.merchantIdRequired') }).min(5, { message: t('validation.auth.merchantIdInvalid') }),
		email_address: z.string({ message: t('validation.auth.emailRequired') }).email({ message: t('validation.auth.emailInvalid') }),
		password: z.string({ message: t('validation.auth.passwordRequired') }).min(6, { message: t('validation.auth.passwordMin6') }),
	});
}

/** @deprecated Use createLoginValidation(t) for i18n. Kept for backward compatibility. */
export const LoginValidation = z.object({
	merchant_id: z.string({ message: 'Merchant Id is required.' }).min(5, { message: 'Invalid Merchant Id.' }),
	email_address: z.string({ message: 'Email is required.' }).email({ message: 'Email must be valid.' }),
	password: z.string({ message: 'Password is required' }).min(6, { message: 'Password must be at least 6 characters' }),
});
