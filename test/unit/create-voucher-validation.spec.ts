import { describe, expect, it } from 'vitest';
import { CreateVoucherValidation } from '../../app/utils/schema/Voucher/Create/CreateVoucherValidation';

const t = (key: string) => key;

describe('CreateVoucherValidation', () => {
	it('accepts minimal valid payload', () => {
		const schema = CreateVoucherValidation(t);
		const parsed = schema.parse({
			code: 'V1',
			name: 'Test',
			is_disabled: false,
			discount_code: 'D1',
		});
		expect(parsed.code).toBe('V1');
	});

	it('rejects empty code', () => {
		const schema = CreateVoucherValidation(t);
		expect(() =>
			schema.parse({
				code: '',
				name: 'Test',
				is_disabled: false,
				discount_code: 'D1',
			}),
		).toThrow();
	});

	it('rejects end before start', () => {
		const schema = CreateVoucherValidation(t);
		expect(() =>
			schema.parse({
				code: 'V1',
				name: 'Test',
				is_disabled: false,
				discount_code: 'D1',
				starts_at: '2026-02-01T00:00:00.000Z',
				ends_at: '2026-01-01T00:00:00.000Z',
			}),
		).toThrow();
	});

	it('accepts optional positive usage_limit', () => {
		const schema = CreateVoucherValidation(t);
		const parsed = schema.parse({
			code: 'V1',
			name: 'Test',
			is_disabled: false,
			discount_code: 'D1',
			usage_limit: 100,
		});
		expect(parsed.usage_limit).toBe(100);
	});
});
