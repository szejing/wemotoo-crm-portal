import { describe, expect, it } from 'vitest';
import { DiscountType } from 'wemotoo-common';
import { CreateDiscountValidation } from '../../app/utils/schema/Discount/Create/CreateDiscountValidation';

const t = (key: string) => key;

const basePayload = {
	code: undefined as string | undefined,
	description: 'Summer sale',
	is_disabled: false,
	starts_at: undefined as string | undefined,
	ends_at: undefined as string | undefined,
	usage_limit: undefined as number | undefined,
	disc_type: DiscountType.PERCENTAGE,
	disc_value: 10,
	allocation: undefined as undefined,
	conditions: [] as {
		filter_operator?: undefined;
		filter_condition?: undefined;
		filter_value?: string;
	}[],
	min_order_amt: undefined as number | undefined,
	max_disc_amt: undefined as number | undefined,
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
			disc_value: 101,
		});
		expect(result.success).toBe(false);
	});

	it('accepts free shipping with disc_value 0', () => {
		const schema = CreateDiscountValidation(t);
		const result = schema.safeParse({
			...basePayload,
			disc_type: DiscountType.FREE_SHIPPING,
			disc_value: 0,
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

	it('accepts min_order_amt and max_disc_amt together', () => {
		const schema = CreateDiscountValidation(t);
		const result = schema.safeParse({
			...basePayload,
			min_order_amt: 100,
			max_disc_amt: 50,
		});
		expect(result.success).toBe(true);
	});

	it('rejects more than one condition', () => {
		const schema = CreateDiscountValidation(t);
		const result = schema.safeParse({
			...basePayload,
			conditions: [{}, {}],
		});
		expect(result.success).toBe(false);
	});
});
