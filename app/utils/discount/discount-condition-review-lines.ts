import { FilterCondition, FilterOperator } from 'wemotoo-common';
import type { CreateDiscountConditionReq } from '../../repository/modules/discount/models/request/create-discount.req';
import { conditionHasCartFilter, formatConditionCartFilterSummary } from './condition-cart-filter-summary';
import { parseFilterValueCsv } from './filter-value-csv';

type Translate = (key: string, values?: Record<string, unknown>) => string;

const formatMoneyAmount = (n: number): string => {
	if (!Number.isFinite(n)) {
		return String(n);
	}
	const x = Math.round(n * 100) / 100;
	return x % 1 === 0 ? String(x) : x.toFixed(2);
};

const spendAmountSentence = (t: Translate, currency: string, cond: CreateDiscountConditionReq): string => {
	const min = cond.min_amount;
	const max = cond.max_amount;
	if (min != null && max != null) {
		return t('components.discountForm.reviewConditionSpendRange', {
			currency,
			min: formatMoneyAmount(min),
			max: formatMoneyAmount(max),
		});
	}
	if (min != null) {
		return t('components.discountForm.reviewConditionSpendMin', {
			currency,
			amount: formatMoneyAmount(min),
		});
	}
	if (max != null) {
		return t('components.discountForm.reviewConditionSpendMax', {
			currency,
			amount: formatMoneyAmount(max),
		});
	}
	return '';
};

/** Filter copy is split so `filter_value` tokens render as badges in the review UI. */
export type ReviewFilterBadged = {
	kind: 'badged';
	leadKey: string;
	values: string[];
};

export type ReviewFilterPart = ReviewFilterBadged | { kind: 'plain'; text: string };

export type ConditionReviewLineItem = {
	amountText?: string;
	filter?: ReviewFilterPart;
};

const badgeValuesFromCsv = (vals: string[], t: Translate): string[] => {
	return vals.length > 0 ? vals : [String(t('common.notSet'))];
};

/**
 * Structured cart rule for the review panel (lead i18n + value tokens for badges).
 */
export function getConditionFilterReviewPart(cond: CreateDiscountConditionReq, t: Translate): ReviewFilterPart | null {
	if (!conditionHasCartFilter(cond)) {
		return null;
	}
	const vals = parseFilterValueCsv(cond.filter_value);
	const op = cond.filter_operator;
	const fc = cond.filter_condition;

	if (op === FilterOperator.INCLUDE) {
		switch (fc) {
			case FilterCondition.PROD_CODE:
				return { kind: 'badged', leadKey: 'components.discountForm.reviewFilterIncludeProductLead', values: badgeValuesFromCsv(vals, t) };
			case FilterCondition.CATG_CODE:
				return { kind: 'badged', leadKey: 'components.discountForm.reviewFilterIncludeCategoryLead', values: badgeValuesFromCsv(vals, t) };
			case FilterCondition.TAG_CODE:
				return { kind: 'badged', leadKey: 'components.discountForm.reviewFilterIncludeTagLead', values: badgeValuesFromCsv(vals, t) };
			case FilterCondition.TYPE:
				return { kind: 'badged', leadKey: 'components.discountForm.reviewFilterIncludeTypeLead', values: badgeValuesFromCsv(vals, t) };
			default:
				break;
		}
	}
	if (op === FilterOperator.EXCLUDE) {
		switch (fc) {
			case FilterCondition.PROD_CODE:
				return { kind: 'badged', leadKey: 'components.discountForm.reviewFilterExcludeProductLead', values: badgeValuesFromCsv(vals, t) };
			case FilterCondition.CATG_CODE:
				return { kind: 'badged', leadKey: 'components.discountForm.reviewFilterExcludeCategoryLead', values: badgeValuesFromCsv(vals, t) };
			case FilterCondition.TAG_CODE:
				return { kind: 'badged', leadKey: 'components.discountForm.reviewFilterExcludeTagLead', values: badgeValuesFromCsv(vals, t) };
			case FilterCondition.TYPE:
				return { kind: 'badged', leadKey: 'components.discountForm.reviewFilterExcludeTypeLead', values: badgeValuesFromCsv(vals, t) };
			default:
				break;
		}
	}

	const valuesStr = vals.join(', ');
	if (valuesStr && (op == null || fc == null)) {
		return { kind: 'badged', leadKey: 'components.discountForm.reviewFilterValuesOnlyLead', values: badgeValuesFromCsv(vals, t) };
	}

	const plain = formatConditionCartFilterSummary(cond, t);
	return plain ? { kind: 'plain', text: plain } : null;
}

/**
 * One list item per discount condition (amount sentence + optional structured filter).
 */
export function buildDiscountConditionReviewItems(
	conditions: CreateDiscountConditionReq[] | undefined,
	t: Translate,
	currencyCode: string,
): ConditionReviewLineItem[] {
	if (!conditions?.length) {
		return [];
	}
	const items: ConditionReviewLineItem[] = [];
	for (const cond of conditions) {
		const amountText = spendAmountSentence(t, currencyCode, cond);
		const filter = getConditionFilterReviewPart(cond, t);
		if (!amountText && !filter) {
			continue;
		}
		items.push({ ...(amountText ? { amountText } : {}), ...(filter ? { filter } : {}) });
	}
	return items;
}
