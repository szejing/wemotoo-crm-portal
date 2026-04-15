import { AllocationType, DiscountType } from 'wemotoo-common';
import type { CreateDiscountConditionReq } from '~/repository/modules/discount/models/request/create-discount.req';
import type { Discount, DiscountCondition } from '~/utils/types/discount';

/** Editable discount form shape aligned with `CreateDiscountValidation` / create flow. */
export type DiscountCreate = {
	code: string;
	description: string;
	is_disabled: boolean;
	starts_at?: string;
	ends_at?: string;
	usage_limit?: number;
	disc_type: DiscountType;
	disc_value: number;
	allocation?: AllocationType;
	min_order_amt?: number;
	max_disc_amt?: number;
	conditions: CreateDiscountConditionReq[];
};

const conditionFromDiscount = (c: DiscountCondition): CreateDiscountConditionReq => {
	return {
		...(c.filter_operator != null ? { filter_operator: c.filter_operator } : {}),
		...(c.filter_condition != null ? { filter_condition: c.filter_condition } : {}),
		filter_value: c.filter_value?.trim() ? c.filter_value : '',
	};
};

export const discountToFormEditableState = (d: Discount): DiscountCreate => {
	return {
		code: d.code,
		description: d.description ?? '',
		is_disabled: d.is_disabled,
		starts_at: d.starts_at ?? undefined,
		ends_at: d.ends_at ?? undefined,
		usage_limit: d.usage_limit ?? undefined,
		disc_type: d.disc_type,
		disc_value: d.disc_value,
		allocation: d.allocation,
		min_order_amt: d.min_order_amt ?? undefined,
		max_disc_amt: d.max_disc_amt ?? undefined,
		conditions: (d.conditions ?? []).map(conditionFromDiscount).slice(0, 1),
	};
};

export const emptyDiscountFormEditableState = (): DiscountCreate => {
	return {
		code: '',
		description: '',
		is_disabled: false,
		starts_at: undefined,
		ends_at: undefined,
		usage_limit: undefined,
		disc_type: DiscountType.PERCENTAGE,
		disc_value: 10,
		allocation: AllocationType.BILL,
		min_order_amt: undefined,
		max_disc_amt: undefined,
		conditions: [],
	};
};

/** Apply server discount into reactive form state (replaces conditions array). */
export const applyDiscountToFormState = (target: DiscountCreate, d: Discount): void => {
	const next = discountToFormEditableState(d);
	target.code = next.code;
	target.description = next.description;
	target.is_disabled = next.is_disabled;
	target.starts_at = next.starts_at;
	target.ends_at = next.ends_at;
	target.usage_limit = next.usage_limit;
	target.disc_type = next.disc_type;
	target.disc_value = next.disc_value;
	target.allocation = next.allocation;
	target.min_order_amt = next.min_order_amt;
	target.max_disc_amt = next.max_disc_amt;
	target.conditions.splice(0, target.conditions.length, ...next.conditions);
};
