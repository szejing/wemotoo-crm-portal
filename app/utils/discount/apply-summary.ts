import { AllocationType, DiscountType } from 'wemotoo-common';

type Translate = (key: string, values?: Record<string, unknown>) => string;

const humanizeUnderscoreEnum = (value: string) =>
	value
		.split('_')
		.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
		.join(' ');

/** Short rule label for review lines (e.g. `10%`, `RM 5`, or translated free shipping). */
export function discountRuleShortForReview(
	t: Translate,
	params: {
		discType: DiscountType | undefined;
		discValue: number | undefined;
		currencyCode?: string;
	},
): string {
	const currencyCode = params.currencyCode ?? 'RM';
	const rt = params.discType ?? DiscountType.PERCENTAGE;
	const rv = params.discValue ?? 0;
	if (rt === DiscountType.FREE_SHIPPING) {
		return t('components.discountForm.discTypeOptionFreeShipping');
	}
	if (rt === DiscountType.PERCENTAGE) {
		return `${rv}%`;
	}
	return `${currencyCode} ${rv}`;
}

export function allocationLabelForReview(t: Translate, allocation: AllocationType | undefined | null): string {
	if (allocation == null) {
		return t('common.notSet');
	}
	return humanizeUnderscoreEnum(allocation);
}

/** Lowercase bill/item style for the voucher “Condition” summary line. */
export function allocationLabelForApplySummary(t: Translate, allocation: AllocationType | undefined | null): string {
	if (allocation == null) {
		return t('common.notSet');
	}
	return humanizeUnderscoreEnum(allocation).toLowerCase();
}

/** One sentence: rule + where it applies (e.g. "10% apply to bill."). */
export function buildDiscountApplySummaryLine(
	t: Translate,
	params: {
		discType: DiscountType | undefined;
		discValue: number | undefined;
		allocation: AllocationType | undefined | null;
		currencyCode?: string;
	},
): string {
	const rule = discountRuleShortForReview(t, params);
	const allocation = allocationLabelForApplySummary(t, params.allocation);
	return t('components.voucherForm.discountApplySummary', { rule, allocation });
}
