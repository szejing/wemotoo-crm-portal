import type { AmountType, FilterCondition, FilterOperator } from 'wemotoo-common';

export type TaxFilterCreate = {
	filter_operator: FilterOperator;
	filter_condition: FilterCondition;
	filter_value: string;
};

export type TaxConditionCreate = {
	tax_code: string;
	starts_at?: Date;
	ends_at?: Date;
	amount_type: AmountType;
	rate: number;
	min_amount?: number;
	max_amount?: number;
	filters: TaxFilterCreate[];
};

export type TaxDetailCreate = {
	description: string;
	tax_code: string;
	tax_condition: TaxConditionCreate;
};

export type TaxRuleCreate = {
	code: string;
	description?: string;
	details: TaxDetailCreate[];
};
