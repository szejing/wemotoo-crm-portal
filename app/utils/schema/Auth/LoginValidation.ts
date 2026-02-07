import { z } from 'zod';

type TranslateFn = (key: string) => string;

export function LoginValidation(t: TranslateFn) {
	return z.object({
		merchant_id: z.string({ message: t('validation.auth.merchantIdRequired') }).min(5, { message: t('validation.auth.merchantIdInvalid') }),
		email_address: z.string({ message: t('validation.auth.emailRequired') }).email({ message: t('validation.auth.emailInvalid') }),
		password: z.string({ message: t('validation.auth.passwordRequired') }).min(6, { message: t('validation.auth.passwordMin6') }),
	});
}
