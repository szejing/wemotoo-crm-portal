import { describe, expect, it } from 'vitest';
import { DiscountRuleType } from 'wemotoo-common';
import { CreateDiscountValidation } from '../../app/utils/schema/Discount/Create/CreateDiscountValidation';

const t = (key: string) => key;

const basePayload = {
	code: 'SAVE10',
	name: 'Save 10',
	description: '',
	status: 'active',
	starts_at: undefined as string | undefined,
	ends_at: undefined as string | undefined,
	usage_limit: undefined as number | undefined,
	rule: {
		type: DiscountRuleType.PERCENTAGE,
		value: 10,
		conditions: [] as [],
	},
};

describe('CreateDiscountValidation', () => {
	it('accepts a valid payload', () => {
		const schema = CreateDiscountValidation(t);
		const result = schema.safeParse(basePayload);
		expect(result.success).toBe(true);
	});

	it('rejects empty code', () => {
		const schema = CreateDiscountValidation(t);
		const result = schema.safeParse({ ...basePayload, code: '' });
		expect(result.success).toBe(false);
	});

	it('rejects percentage value outside 1–100', () => {
		const schema = CreateDiscountValidation(t);
		const result = schema.safeParse({
			...basePayload,
			rule: { ...basePayload.rule, value: 101 },
		});
		expect(result.success).toBe(false);
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
});
