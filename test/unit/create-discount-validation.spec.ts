import { describe, expect, it } from 'vitest';
import { DiscountConditionOperator, DiscountConditionType, DiscountRuleType } from 'wemotoo-common';
import { CreateDiscountValidation } from '../../app/utils/schema/Discount/Create/CreateDiscountValidation';

const t = (key: string) => key;

const basePayload = {
	code: undefined as string | undefined,
	description: 'Summer sale',
	is_disabled: false,
	starts_at: undefined as string | undefined,
	ends_at: undefined as string | undefined,
	usage_limit: undefined as number | undefined,
	rule_type: DiscountRuleType.PERCENTAGE,
	rule_value: 10,
	allocation: undefined as undefined,
	conditions: [] as {
		operator: DiscountConditionOperator;
		type: DiscountConditionType;
		min_amount?: number;
		max_amount?: number;
		filter_operator?: undefined;
		filter_condition?: undefined;
		filter_value?: string;
	}[],
};

describe('CreateDiscountValidation', () => {
	it('accepts a valid payload', () => {
		const schema = CreateDiscountValidation(t);
		const result = schema.safeParse(basePayload);
		expect(result.success).toBe(true);
	});

	it('accepts optional code (auto-generate on API)', () => {
		const schema = CreateDiscountValidation(t);
		const result = schema.safeParse({
			...basePayload,
			code: '',
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.code).toBeUndefined();
		}
	});

	it('rejects empty description', () => {
		const schema = CreateDiscountValidation(t);
		const result = schema.safeParse({ ...basePayload, description: '' });
		expect(result.success).toBe(false);
	});

	it('rejects percentage value outside 1–100', () => {
		const schema = CreateDiscountValidation(t);
		const result = schema.safeParse({
			...basePayload,
			rule_value: 101,
		});
		expect(result.success).toBe(false);
	});

	it('accepts free shipping with rule_value 0', () => {
		const schema = CreateDiscountValidation(t);
		const result = schema.safeParse({
			...basePayload,
			rule_type: DiscountRuleType.FREE_SHIPPING,
			rule_value: 0,
		});
		expect(result.success).toBe(true);
	});

	it('rejects when end date is before start date', () => {
		const schema = CreateDiscountValidation(t);
		const result = schema.safeParse({
			...basePayload,
			starts_at: '2026-02-01T00:00:00.000Z',
			ends_at: '2026-01-01T00:00:00.000Z',
		});
		expect(result.success).toBe(false);
	});

	it('rejects when condition min_amount > max_amount', () => {
		const schema = CreateDiscountValidation(t);
		const result = schema.safeParse({
			...basePayload,
			conditions: [
				{
					operator: DiscountConditionOperator.IN,
					type: DiscountConditionType.PRODUCTS,
					min_amount: 100,
					max_amount: 50,
				},
			],
		});
		expect(result.success).toBe(false);
	});
});
