import type { AllocationType, DiscountRuleType, FilterOperator } from 'wemotoo-common';
import type { FilterCondition } from 'wemotoo-common';

export type Discount = {
	code: string;
	description: string;
	is_disabled: boolean;
	starts_at: string | null;
	ends_at: string | null;
	usage_limit: number | null;
	usage_count: number;
	rule_type: DiscountRuleType;
	rule_value: number;
	allocation: AllocationType;
	conditions: DiscountCondition[];
	created_at: string;
	updated_at: string;
	metadata?: Record<string, unknown>;
};

export type DiscountCondition = {
	id?: number;
	min_amount?: number | null;
	max_amount?: number | null;
	filter_operator?: FilterOperator | null;
	filter_condition?: FilterCondition | null;
	filter_value?: string | null;
};
