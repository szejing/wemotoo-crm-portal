import { z } from 'zod';

export type TranslateFn = (key: string) => string;

export function createForgotPasswordValidation(t: TranslateFn) {
	return z.object({
		merchant_id: z.string({ message: t('validation.auth.merchantIdRequired') }).min(5, { message: t('validation.auth.merchantIdInvalid') }),
		email_address: z.string({ message: t('validation.auth.emailRequired') }).email({ message: t('validation.auth.emailInvalid') }),
	});
}

export const ForgotPasswordValidation = z.object({
	merchant_id: z.string({ message: 'Merchant Id is required.' }).min(5, { message: 'Invalid Merchant Id.' }),
	email_address: z.string({ message: 'Email is required.' }).email({ message: 'Email must be valid.' }),
});
