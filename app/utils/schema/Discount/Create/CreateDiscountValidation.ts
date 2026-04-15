import { z } from 'zod';
import { AllocationType, DiscountType, FilterCondition, FilterOperator } from 'wemotoo-common';

type TranslateFn = (key: string) => string;

const optionalNonNegativeNumber = z.preprocess((val) => {
	if (val === '' || val === null || val === undefined) return undefined;
	const n = typeof val === 'number' ? val : Number(val);
	if (Number.isNaN(n)) return undefined;
	return n;
}, z.number().min(0).optional());

export function CreateDiscountValidation(t: TranslateFn) {
	const discountConditionSchema = z.object({
		filter_operator: z.nativeEnum(FilterOperator).optional(),
		filter_condition: z.nativeEnum(FilterCondition).optional(),
		filter_value: z.string().optional(),
	});

	return z
		.object({
			code: z
				.string()
				.optional()
				.transform((v) => {
					const s = v?.trim();
					return s === '' || s === undefined ? undefined : s;
				}),
			description: z.string({ message: t('validation.discount.descriptionRequired') }).min(1, t('validation.discount.descriptionRequired')),
			is_disabled: z.boolean(),
			starts_at: z.string().optional(),
			ends_at: z.string().optional(),
			usage_limit: z.number().int().positive().optional(),
			disc_type: z.nativeEnum(DiscountType),
			disc_value: z.number(),
			allocation: z.nativeEnum(AllocationType).optional(),
			min_order_amt: optionalNonNegativeNumber,
			max_disc_amt: optionalNonNegativeNumber,
			conditions: z
				.array(discountConditionSchema)
				.max(1, { message: t('validation.discount.atMostOneCondition') })
				.default([]),
		})
		.superRefine((data, ctx) => {
			if (data.starts_at && data.ends_at && data.starts_at > data.ends_at) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: t('validation.discount.endBeforeStart'),
					path: ['ends_at'],
				});
			}

			if (data.disc_type === DiscountType.PERCENTAGE) {
				if (data.disc_value <= 0 || data.disc_value > 100) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: t('validation.discount.percentageValueRange'),
						path: ['disc_value'],
					});
				}
			} else if (data.disc_type === DiscountType.FIXED) {
				if (data.disc_value <= 0) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: t('validation.discount.fixedValuePositive'),
						path: ['disc_value'],
					});
				}
			} else if (data.disc_type === DiscountType.FREE_SHIPPING) {
				if (data.disc_value < 0) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: t('validation.discount.freeShippingValueNonNegative'),
						path: ['disc_value'],
					});
				}
			}
		});
}
