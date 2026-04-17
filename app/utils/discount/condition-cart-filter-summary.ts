import type { CreateDiscountConditionReq } from '../../repository/modules/discount/models/request/create-discount.req';
import { parseFilterValueCsv } from './filter-value-csv';

type Translate = (key: string, values?: Record<string, unknown>) => string;

const humanizeUnderscoreEnum = (value: string) =>
	value
		.split('_')
		.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
		.join(' ');

export function conditionHasCartFilter(cond: CreateDiscountConditionReq): boolean {
	const hasValues = parseFilterValueCsv(cond.filter_value).length > 0;
	return cond.filter_operator != null || cond.filter_condition != null || hasValues;
}

/** Readable cart filter line for operator / field / picked values. */
export function formatConditionCartFilterSummary(cond: CreateDiscountConditionReq, t: Translate): string {
	const operator =
		cond.filter_operator != null ? humanizeUnderscoreEnum(cond.filter_operator) : t('common.notSet');
	const field =
		cond.filter_condition != null ? humanizeUnderscoreEnum(cond.filter_condition) : t('common.notSet');
	const vals = parseFilterValueCsv(cond.filter_value);
	const valuesPart =
		vals.length > 0 ? t('components.discountForm.conditionCartFilterValuesPart', { values: vals.join(', ') }) : '';
	return t('components.discountForm.conditionCartFilterSummary', {
		operator,
		field,
		valuesPart,
	});
}
