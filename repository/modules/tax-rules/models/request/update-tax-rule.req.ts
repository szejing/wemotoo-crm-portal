import type { AmountType, FilterCondition, FilterOperator } from 'wemotoo-common';

export type UpdateTaxFilter = {
	id: number;
	filter_operator: FilterOperator;
	filter_condition: FilterCondition;
	filter_value: string;
};

export type UpdateTaxCondition = {
	id: number;
	tax_code: string;
	starts_at?: Date;
	ends_at?: Date;
	amount_type: AmountType;
	rate: number;
	min_amount?: number;
	max_amount?: number;
	filters: UpdateTaxFilter[];
};

export type UpdateTaxDetail = {
	id: number;
	description: string;
	tax_code: string;
	tax_condition: UpdateTaxCondition;
};

export type UpdateTaxRuleReq = {
	code: string;
	description: string;
	details: UpdateTaxDetail[];
};
