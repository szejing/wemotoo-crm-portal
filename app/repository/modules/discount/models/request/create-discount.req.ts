import type {
	AllocationType,
	DiscountConditionOperator,
	DiscountConditionType,
	DiscountRuleType,
	FilterCondition,
	FilterOperator,
} from 'wemotoo-common';

/** Matches ecommerce-nestjs `CreateDiscountConditionDto` (flat filter fields). */
export type CreateDiscountConditionReq = {
	operator: DiscountConditionOperator;
	type: DiscountConditionType;
	min_amount?: number;
	max_amount?: number;
	filter_operator?: FilterOperator;
	filter_condition?: FilterCondition;
	filter_value?: string;
};

/** Matches ecommerce-nestjs `CreateDiscountDto`. */
export type CreateDiscountReq = {
	code?: string;
	description?: string;
	is_disabled?: boolean;
	starts_at?: string;
	ends_at?: string;
	usage_limit?: number;
	rule_type: DiscountRuleType;
	rule_value: number;
	allocation?: AllocationType;
	conditions?: CreateDiscountConditionReq[];
	metadata?: Record<string, unknown>;
};
