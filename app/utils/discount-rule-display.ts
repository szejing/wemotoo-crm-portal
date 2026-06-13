import { DiscountType, formatCurrency } from 'yeppi-common';

export function formatDiscountDiscValue(discType: DiscountType, discValue: number): string {
	if (discType === DiscountType.PERCENTAGE) {
		return `${discValue}%`;
	}
	if (discType === DiscountType.FIXED) {
		return formatCurrency(discValue, 'MYR');
	}
	return String(discValue);
}
