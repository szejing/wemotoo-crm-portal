import { DiscountRuleType, formatCurrency } from 'wemotoo-common';

export function formatDiscountRuleValue(ruleType: DiscountRuleType, ruleValue: number): string {
	if (ruleType === DiscountRuleType.PERCENTAGE) {
		return `${ruleValue}%`;
	}
	if (ruleType === DiscountRuleType.FIXED) {
		return formatCurrency(ruleValue, 'MYR');
	}
	return String(ruleValue);
}
