import { describe, expect, it } from 'vitest';
import { AllocationType, DiscountRuleType } from 'wemotoo-common';
import { UpdateVoucherFormValidation } from '../../app/utils/schema/Voucher/Update/UpdateVoucherFormValidation';

const t = (key: string) => key;

describe('UpdateVoucherFormValidation', () => {
	it('accepts valid nested voucher and discount', () => {
		const schema = UpdateVoucherFormValidation(t, { linkDiscountToVoucher: false });
		const parsed = schema.parse({
			voucher: {
				code: 'V1',
				name: 'Test',
				is_disabled: false,
				discount_code: 'D1',
			},
			discount: {
				description: 'D desc',
				is_disabled: false,
				disc_type: DiscountRuleType.PERCENTAGE,
				disc_value: 10,
				allocation: AllocationType.BILL,
				conditions: [],
			},
		});
		expect(parsed.voucher.code).toBe('V1');
		expect(parsed.discount.disc_type).toBe(DiscountRuleType.PERCENTAGE);
	});

	it('rejects voucher end before start', () => {
		const schema = UpdateVoucherFormValidation(t, { linkDiscountToVoucher: false });
		expect(() =>
			schema.parse({
				voucher: {
					code: 'V1',
					name: 'Test',
					is_disabled: false,
					discount_code: 'D1',
					starts_at: '2026-02-01T00:00:00.000Z',
					ends_at: '2026-01-01T00:00:00.000Z',
				},
				discount: {
					description: 'D',
					is_disabled: false,
					disc_type: DiscountRuleType.PERCENTAGE,
					disc_value: 10,
					conditions: [],
				},
			}),
		).toThrow();
	});
});
