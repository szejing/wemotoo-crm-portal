import type { TaxRule, TaxRuleInput } from './tax-rule';

// Input type for create/update operations
export type OutletInput = {
	code: string;
	description: string;
	address1: string;
	address2?: string;
	address3?: string;
	city: string;
	country_code: string;
	state: string;
	postal_code: string;
	longitude?: number;
	latitude?: number;
	tax_rule_code?: string;
	metadata?: Record<string, unknown>;
};

// Reference type for selections
export type OutletRef = {
	code: string;
	description: string;
};

// Model type for display/read operations
export type Outlet = {
	code: string;
	description: string;
	address1: string;
	address2?: string;
	address3?: string;
	city: string;
	country_code: string;
	state: string;
	postal_code: string;
	longitude?: number;
	latitude?: number;
	tax_rule?: TaxRule;
	metadata?: Record<string, unknown>;
	created_at?: string;
	updated_at?: string;
};
