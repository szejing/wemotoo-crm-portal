import { z } from 'zod';

type TranslateFn = (key: string) => string;

export type CreateVoucherValidationOptions = {
	/** Voucher code doubles as new discount code; discount picker is hidden. */
	linkDiscountToVoucher?: boolean;
};

export function CreateVoucherValidation(t: TranslateFn, opts?: CreateVoucherValidationOptions) {
	const nameSchema = opts?.linkDiscountToVoucher
		? z
				.string()
				.optional()
				.transform((v) => (typeof v === 'string' ? v.trim() : ''))
		: z.string({ message: t('validation.voucher.nameRequired') }).min(1, t('validation.voucher.nameRequired'));

	return z
		.object({
			code: z.string({ message: t('validation.voucher.codeRequired') }).min(1, t('validation.voucher.codeRequired')),
			name: nameSchema,
			description: z.string().optional(),
			status: z.string({ message: t('validation.voucher.statusRequired') }).min(1, t('validation.voucher.statusRequired')),
			discount_code: opts?.linkDiscountToVoucher ? z.string().optional() : z.string(),
			starts_at: z.string().optional(),
			ends_at: z.string().optional(),
			usage_limit: z.number().int().positive().optional(),
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
