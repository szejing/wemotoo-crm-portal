import { describe, expect, it } from 'vitest';
import { voucherDateToFormIso } from '../../app/utils/voucher/date';

describe('voucherDateToFormIso', () => {
	it('returns undefined for null, undefined, or invalid strings', () => {
		expect(voucherDateToFormIso(undefined)).toBeUndefined();
		expect(voucherDateToFormIso(null)).toBeUndefined();
		expect(voucherDateToFormIso('not-a-date')).toBeUndefined();
	});

	it('returns ISO string for Date instances', () => {
		const d = new Date('2026-04-14T00:00:00.000Z');
		expect(voucherDateToFormIso(d)).toBe('2026-04-14T00:00:00.000Z');
	});

	it('returns ISO string for valid ISO date strings (API JSON)', () => {
		expect(voucherDateToFormIso('2026-04-14T00:00:00.000Z')).toBe('2026-04-14T00:00:00.000Z');
	});
});
