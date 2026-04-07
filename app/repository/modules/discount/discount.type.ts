import type {
	AllocationType,
	DiscountConditionOperator,
	DiscountConditionType,
	DiscountRuleType,
	FilterCondition,
	FilterOperator,
} from 'wemotoo-common';
import type { BaseODataResp } from '~/repository/base/base.resp';

/** Matches ecommerce-nestjs `CreateDiscountConditionDto` (flat filter fields). */
export interface CreateDiscountConditionRequest {
	operator: DiscountConditionOperator;
	type: DiscountConditionType;
	min_amount?: number;
	max_amount?: number;
	filter_operator?: FilterOperator;
	filter_condition?: FilterCondition;
	filter_value?: string;
}

/** Matches ecommerce-nestjs `CreateDiscountDto`. */
export interface CreateDiscountRequest {
	code?: string;
	description?: string;
	is_disabled?: boolean;
	starts_at?: string;
	ends_at?: string;
	usage_limit?: number;
	rule_type: DiscountRuleType;
	rule_value: number;
	allocation?: AllocationType;
	conditions?: CreateDiscountConditionRequest[];
	metadata?: Record<string, unknown>;
}

export type UpdateDiscountRequest = Partial<CreateDiscountRequest>;

export interface DiscountConditionResponse {
	id: number;
	operator: string;
	type: string;
	min_amount?: number | null;
	max_amount?: number | null;
	filter_operator?: string | null;
	filter_condition?: string | null;
	filter_value?: string | null;
	metadata?: Record<string, unknown>;
}

export interface DiscountResponse {
	code: string;
	description: string;
	is_disabled: boolean;
	starts_at: string | null;
	ends_at: string | null;
	usage_limit: number | null;
	usage_count: number;
	rule_type: string;
	rule_value: number;
	allocation: string | null;
	conditions: DiscountConditionResponse[];
	metadata?: Record<string, unknown>;
	created_at?: string;
	updated_at?: string;
}

export type BaseDiscountResponse = DiscountResponse;
export type PaginatedDiscountResponse = BaseODataResp<DiscountResponse>;
