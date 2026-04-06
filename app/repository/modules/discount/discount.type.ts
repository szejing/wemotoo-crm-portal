import type { DiscountRuleType, DiscountConditionType, FilterCondition } from 'wemotoo-common';
import type { BaseODataResp } from '~/repository/base/base.resp';

export interface CreateDiscountFilterRequest {
	operator: 'AND' | 'OR';
	condition: FilterCondition;
	value: string;
}

export interface CreateDiscountConditionRequest {
	type: DiscountConditionType;
	filters: CreateDiscountFilterRequest[];
}

export interface CreateDiscountRuleRequest {
	type: DiscountRuleType;
	value: number;
	conditions: CreateDiscountConditionRequest[];
}

export interface CreateDiscountRequest {
	code: string;
	name: string;
	description?: string;
	status: string;
	starts_at?: string;
	ends_at?: string;
	usage_limit?: number;
	rule: CreateDiscountRuleRequest;
}

export type UpdateDiscountRequest = Partial<CreateDiscountRequest>;

export interface DiscountFilterResponse {
	id: number;
	operator: 'AND' | 'OR';
	condition: FilterCondition;
	value: string;
}

export interface DiscountConditionResponse {
	id: number;
	type: DiscountConditionType;
	filters: DiscountFilterResponse[];
}

export interface DiscountRuleResponse {
	id: number;
	type: DiscountRuleType;
	value: string;
	conditions: DiscountConditionResponse[];
}

export interface DiscountResponse {
	code: string;
	name: string;
	description: string | null;
	status: string;
	starts_at: string | null;
	ends_at: string | null;
	usage_limit: number | null;
	usage_count: number;
	rule: DiscountRuleResponse | null;
	created_at: string;
	updated_at: string;
}

export type BaseDiscountResponse = DiscountResponse;
export type PaginatedDiscountResponse = BaseODataResp<DiscountResponse>;
