import { describe, expect, it } from 'vitest';
import { FilterCondition, FilterOperator } from 'wemotoo-common';
import type { CreateDiscountConditionReq } from '../../app/repository/modules/discount/models/request/create-discount.req';
import { conditionHasCartFilter, formatConditionCartFilterSummary } from '../../app/utils/discount/condition-cart-filter-summary';

const t = ((key: string, values?: Record<string, unknown>) => {
	if (key === 'common.notSet') return 'Not set';
	if (key === 'components.discountForm.conditionCartFilterValuesPart') return ` · values: ${values?.values}`;
	if (key === 'components.discountForm.conditionCartFilterSummary') {
		return `Cart filter: ${values?.operator} · ${values?.field}${values?.valuesPart}.`;
	}
	return key;
}) as (key: string, values?: Record<string, unknown>) => string;

describe('condition cart filter summary', () => {
	it('conditionHasCartFilter is false for empty optional filters', () => {
		const cond: CreateDiscountConditionReq = {
			min_amount: 1,
			max_amount: 2,
			filter_operator: undefined,
			filter_condition: undefined,
			filter_value: '',
		};
		expect(conditionHasCartFilter(cond)).toBe(false);
	});

	it('formatConditionCartFilterSummary includes operator, field, and values', () => {
		const cond: CreateDiscountConditionReq = {
			filter_operator: FilterOperator.INCLUDE,
			filter_condition: FilterCondition.PROD_CODE,
			filter_value: 'A001,B002',
		};
		expect(formatConditionCartFilterSummary(cond, t)).toBe('Cart filter: Include · Product Code · values: A001, B002.');
	});
});
