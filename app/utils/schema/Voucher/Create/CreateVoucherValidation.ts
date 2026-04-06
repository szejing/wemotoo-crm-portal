import { z } from 'zod';

type TranslateFn = (key: string) => string;

export function CreateVoucherValidation(t: TranslateFn) {
	return z
		.object({
			code: z.string({ message: t('validation.voucher.codeRequired') }).min(1, t('validation.voucher.codeRequired')),
			name: z.string({ message: t('validation.voucher.nameRequired') }).min(1, t('validation.voucher.nameRequired')),
			description: z.string().optional(),
			status: z.string({ message: t('validation.voucher.statusRequired') }).min(1, t('validation.voucher.statusRequired')),
			discount_code: z.string().optional(),
			starts_at: z.string().optional(),
			ends_at: z.string().optional(),
		})
		.superRefine((data, ctx) => {
			if (data.starts_at && data.ends_at && data.starts_at > data.ends_at) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: t('validation.voucher.endBeforeStart'),
					path: ['ends_at'],
				});
			}
		});
}
