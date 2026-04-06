import { z } from 'zod';
import { DiscountConditionType, DiscountRuleType, FilterCondition } from 'wemotoo-common';

type TranslateFn = (key: string) => string;

export function CreateDiscountValidation(t: TranslateFn) {
	const discountFilterSchema = z.object({
		operator: z.enum(['AND', 'OR']),
		condition: z.nativeEnum(FilterCondition),
		value: z.string({ message: t('validation.discount.filterValueRequired') }).min(1, t('validation.discount.filterValueRequired')),
	});

	const discountConditionSchema = z.object({
		type: z.nativeEnum(DiscountConditionType),
		filters: z.array(discountFilterSchema),
	});

	const discountRuleSchema = z
		.object({
			type: z.nativeEnum(DiscountRuleType),
			value: z.number(),
			conditions: z.array(discountConditionSchema),
		})
		.superRefine((data, ctx) => {
			if (data.type === DiscountRuleType.PERCENTAGE) {
				if (data.value <= 0 || data.value > 100) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: t('validation.discount.percentageValueRange'),
						path: ['value'],
					});
				}
			} else if (data.type === DiscountRuleType.FIXED) {
				if (data.value <= 0) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: t('validation.discount.fixedValuePositive'),
						path: ['value'],
					});
				}
			}
		});

	return z
		.object({
			code: z.string({ message: t('validation.discount.codeRequired') }).min(1, t('validation.discount.codeRequired')),
			name: z.string({ message: t('validation.discount.nameRequired') }).min(1, t('validation.discount.nameRequired')),
			description: z.string().optional(),
			status: z.string({ message: t('validation.discount.statusRequired') }).min(1, t('validation.discount.statusRequired')),
			starts_at: z.string().optional(),
			ends_at: z.string().optional(),
			usage_limit: z.number().int().positive().optional(),
			rule: discountRuleSchema,
		})
		.superRefine((data, ctx) => {
			if (data.starts_at && data.ends_at && data.starts_at > data.ends_at) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: t('validation.discount.endBeforeStart'),
					path: ['ends_at'],
				});
			}
		});
}
