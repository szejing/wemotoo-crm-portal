import { describe, expect, it } from 'vitest';
import { DiscountType } from 'wemotoo-common';
import { formatDiscountDiscValue } from '../../app/utils/discount-rule-display';

describe('formatDiscountDiscValue', () => {
	it('formats percentage', () => {
		expect(formatDiscountDiscValue(DiscountType.PERCENTAGE, 12.5)).toBe('12.5%');
	});

	it('formats fixed with MYR', () => {
		expect(formatDiscountDiscValue(DiscountType.FIXED, 10)).toMatch(/10/);
	});

	it('stringifies other rule types', () => {
		expect(formatDiscountDiscValue(DiscountType.FREE_SHIPPING, 0)).toBe('0');
	});
});
