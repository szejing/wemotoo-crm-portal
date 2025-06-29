import type { AmountType, FilterCondition, FilterOperator } from 'wemotoo-common';

export type CreateTaxFilter = {
	filter_operator: FilterOperator | undefined;
	filter_condition: FilterCondition | undefined;
	filter_value: string | undefined;
};

export type CreateTaxCondition = {
	tax_code: string | undefined;
	starts_at?: Date | undefined;
	ends_at?: Date | undefined;
	amount_type: AmountType | undefined;
	rate: number | undefined;
	min_amount?: number | undefined;
	max_amount?: number | undefined;
	filters: CreateTaxFilter[];
};

export type CreateTaxDetail = {
	description: string | undefined;
	tax_code?: string | undefined;
	tax_condition: CreateTaxCondition;
};

export type CreateTaxRuleReq = {
	code: string | undefined;
	description: string | undefined;
	details: CreateTaxDetail[];
};
