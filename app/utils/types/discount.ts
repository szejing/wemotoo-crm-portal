import type { AllocationType, DiscountType, FilterOperator } from 'wemotoo-common';
import type { FilterCondition } from 'wemotoo-common';

export type Discount = {
	code: string;
	description: string;
	is_disabled: boolean;
	starts_at: string | null;
	ends_at: string | null;
	usage_limit: number | null;
	usage_count: number;
	disc_type: DiscountType;
	disc_value: number;
	allocation: AllocationType;
	min_order_amt?: number | null;
	max_disc_amt?: number | null;
	conditions: DiscountCondition[];
	created_at: string;
	updated_at: string;
	metadata?: Record<string, unknown>;
};

export type DiscountCondition = {
	id?: number;
	disc_value?: number | null;
	filter_operator?: FilterOperator | null;
	filter_condition?: FilterCondition | null;
	filter_value?: string | null;
};
