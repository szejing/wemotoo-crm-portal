import { z } from 'zod';

export type TranslateFn = (key: string) => string;

export function ForgotPasswordValidation(t: TranslateFn) {
	return z.object({
		merchant_id: z.string({ message: t('validation.auth.merchantIdRequired') }).min(5, { message: t('validation.auth.merchantIdInvalid') }),
		email_address: z.string({ message: t('validation.auth.emailRequired') }).email({ message: t('validation.auth.emailInvalid') }),
	});
}
