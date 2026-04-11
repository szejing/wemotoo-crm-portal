import { describe, expect, it } from 'vitest';
import { DiscountRuleType } from 'wemotoo-common';
import { formatDiscountRuleValue } from '../../app/utils/discount-rule-display';

describe('formatDiscountRuleValue', () => {
	it('formats percentage', () => {
		expect(formatDiscountRuleValue(DiscountRuleType.PERCENTAGE, 12.5)).toBe('12.5%');
	});

	it('formats fixed with MYR', () => {
		expect(formatDiscountRuleValue(DiscountRuleType.FIXED, 10)).toMatch(/10/);
	});

	it('stringifies other rule types', () => {
		expect(formatDiscountRuleValue(DiscountRuleType.FREE_SHIPPING, 0)).toBe('0');
	});
});
