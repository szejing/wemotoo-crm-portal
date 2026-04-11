import { describe, expect, it } from 'vitest';
import { AllocationType, DiscountRuleType } from 'wemotoo-common';
import { CreateBundledVoucherFormValidation } from '../../app/utils/schema/Voucher/Create/CreateBundledVoucherFormValidation';

const t = (key: string) => key;

describe('CreateBundledVoucherFormValidation', () => {
	it('accepts valid voucher + discount payload', () => {
		const schema = CreateBundledVoucherFormValidation(t);
		const parsed = schema.parse({
			voucher: {
				code: 'VSAVE10',
				name: 'VSAVE10',
				description: 'Save 10',
				status: 'active',
				starts_at: '2026-01-01T00:00:00.000Z',
				ends_at: '2026-12-31T23:59:59.999Z',
			},
			discount: {
				code: 'VSAVE10',
				description: 'Save 10',
				is_disabled: false,
				usage_limit: 50,
				rule_type: DiscountRuleType.PERCENTAGE,
				rule_value: 10,
				allocation: AllocationType.BILL,
				conditions: [{}],
			},
		});
		expect(parsed.voucher.code).toBe('VSAVE10');
		expect(parsed.discount.rule_type).toBe(DiscountRuleType.PERCENTAGE);
		expect(parsed.discount.usage_limit).toBe(50);
	});

	it('rejects invalid percentage rule_value on discount', () => {
		const schema = CreateBundledVoucherFormValidation(t);
		expect(() =>
			schema.parse({
				voucher: {
					code: 'V1',
					status: 'active',
				},
				discount: {
					description: 'd',
					is_disabled: false,
					rule_type: DiscountRuleType.PERCENTAGE,
					rule_value: 101,
				},
			}),
		).toThrow();
	});
});
