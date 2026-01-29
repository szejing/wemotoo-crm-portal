export type OutletCreate = {
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
