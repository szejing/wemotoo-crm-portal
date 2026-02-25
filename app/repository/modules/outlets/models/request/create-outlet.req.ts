export type CreateOutletReq = {
	code: string;
	description: string;
	address1: string;
	address2?: string | undefined;
	address3?: string | undefined;
	city: string;
	country_code: string;
	state: string;
	postal_code: string;
	longitude?: number | undefined;
	latitude?: number | undefined;
	tax_rule_code?: string;
	metadata?: Record<string, unknown>;
};
