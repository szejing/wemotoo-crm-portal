import { describe, expect, it } from 'vitest';
import { AllocationType, DiscountRuleType } from 'wemotoo-common';
import { buildDiscountApplySummaryLine, discountRuleShortForReview } from '../../app/utils/discount/apply-summary';

const t = ((key: string, values?: Record<string, unknown>) => {
	if (key === 'components.discountForm.ruleTypeOptionFreeShipping') return 'Free shipping';
	if (key === 'common.notSet') return 'Not set';
	if (key === 'components.voucherForm.discountApplySummary') {
		return `${values?.rule} apply to ${values?.allocation}.`;
	}
	return key;
}) as (key: string, values?: Record<string, unknown>) => string;

describe('discount apply summary', () => {
	it('buildDiscountApplySummaryLine combines percentage and allocation', () => {
		const line = buildDiscountApplySummaryLine(t, {
			ruleType: DiscountRuleType.PERCENTAGE,
			ruleValue: 10,
			allocation: AllocationType.BILL,
		});
		expect(line).toBe('10% apply to bill.');
	});

	it('discountRuleShortForReview uses currency for fixed amount', () => {
		expect(
			discountRuleShortForReview(t, {
				ruleType: DiscountRuleType.FIXED,
				ruleValue: 5,
				currencyCode: 'RM',
			}),
		).toBe('RM 5');
	});
});
