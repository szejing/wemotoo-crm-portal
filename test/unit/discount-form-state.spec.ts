import { describe, expect, it } from 'vitest';
import { AllocationType, DiscountRuleType } from 'wemotoo-common';
import {
	applyDiscountToFormState,
	discountToFormEditableState,
	emptyDiscountFormEditableState,
} from '../../app/utils/types/form/discount-creation';
import type { Discount } from '../../app/utils/types/discount';

describe('discountToFormEditableState', () => {
	it('maps API nulls to undefined and copies conditions', () => {
		const d: Discount = {
			code: 'SAVE10',
			description: 'Ten percent',
			is_disabled: false,
			starts_at: null,
			ends_at: null,
			usage_limit: null,
			usage_count: 0,
			rule_type: DiscountRuleType.PERCENTAGE,
			rule_value: 10,
			allocation: AllocationType.BILL,
			conditions: [
				{
					min_amount: null,
					max_amount: null,
					filter_operator: null,
					filter_condition: null,
					filter_value: 'SKU1',
				},
			],
			created_at: '',
			updated_at: '',
		};

		const s = discountToFormEditableState(d);
		expect(s.code).toBe('SAVE10');
		expect(s.starts_at).toBeUndefined();
		expect(s.ends_at).toBeUndefined();
		expect(s.usage_limit).toBeUndefined();
		expect(s.conditions).toHaveLength(1);
		expect(s.conditions[0]?.filter_value).toBe('SKU1');
	});
});

describe('applyDiscountToFormState', () => {
	it('replaces conditions without sharing array reference issues', () => {
		const target = emptyDiscountFormEditableState();
		target.conditions.push({});

		const d: Discount = {
			code: 'X',
			description: 'd',
			is_disabled: true,
			starts_at: null,
			ends_at: null,
			usage_limit: 5,
			usage_count: 1,
			rule_type: DiscountRuleType.FIXED,
			rule_value: 2,
			allocation: AllocationType.ITEM,
			conditions: [],
			created_at: '',
			updated_at: '',
		};

		applyDiscountToFormState(target, d);
		expect(target.code).toBe('X');
		expect(target.usage_limit).toBe(5);
		expect(target.conditions).toEqual([]);
	});
});
