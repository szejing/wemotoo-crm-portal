import { AllocationType, DiscountRuleType } from 'wemotoo-common';
import type { CreateDiscountConditionReq } from '~/repository/modules/discount/models/request/create-discount.req';
import type { Discount, DiscountCondition } from '~/utils/types/discount';

/** Editable discount form shape aligned with `CreateDiscountValidation` / create flow. */
export type DiscountFormEditableState = {
	code: string;
	description: string;
	is_disabled: boolean;
	starts_at?: string;
	ends_at?: string;
	usage_limit?: number;
	rule_type: DiscountRuleType;
	rule_value: number;
	allocation?: AllocationType;
	conditions: CreateDiscountConditionReq[];
};

function conditionFromDiscount(c: DiscountCondition): CreateDiscountConditionReq {
	return {
		operator: c.operator,
		type: c.type,
		...(c.min_amount != null ? { min_amount: c.min_amount } : {}),
		...(c.max_amount != null ? { max_amount: c.max_amount } : {}),
		...(c.filter_operator != null ? { filter_operator: c.filter_operator } : {}),
		...(c.filter_condition != null ? { filter_condition: c.filter_condition } : {}),
		filter_value: c.filter_value?.trim() ? c.filter_value : '',
	};
}

export function discountToFormEditableState(d: Discount): DiscountFormEditableState {
	return {
		code: d.code,
		description: d.description ?? '',
		is_disabled: d.is_disabled,
		starts_at: d.starts_at ?? undefined,
		ends_at: d.ends_at ?? undefined,
		usage_limit: d.usage_limit ?? undefined,
		rule_type: d.rule_type,
		rule_value: d.rule_value,
		allocation: d.allocation,
		conditions: (d.conditions ?? []).map(conditionFromDiscount),
	};
}

export function emptyDiscountFormEditableState(): DiscountFormEditableState {
	return {
		code: '',
		description: '',
		is_disabled: false,
		starts_at: undefined,
		ends_at: undefined,
		usage_limit: undefined,
		rule_type: DiscountRuleType.PERCENTAGE,
		rule_value: 10,
		allocation: AllocationType.BILL,
		conditions: [],
	};
}

/** Apply server discount into reactive form state (replaces conditions array). */
export function applyDiscountToFormState(target: DiscountFormEditableState, d: Discount): void {
	const next = discountToFormEditableState(d);
	target.code = next.code;
	target.description = next.description;
	target.is_disabled = next.is_disabled;
	target.starts_at = next.starts_at;
	target.ends_at = next.ends_at;
	target.usage_limit = next.usage_limit;
	target.rule_type = next.rule_type;
	target.rule_value = next.rule_value;
	target.allocation = next.allocation;
	target.conditions.splice(0, target.conditions.length, ...next.conditions);
}
