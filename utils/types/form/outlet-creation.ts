import type { TaxRuleInput } from '../tax-rule';

export type OutletCreate = {
	code: string | undefined;
	description: string | undefined;
	address1: string | undefined;
	address2: string | undefined;
	address3: string | undefined;
	city: string | undefined;
	country_code: string | undefined;
	state: string | undefined;
	postal_code: string | undefined;
	longitude: number | undefined;
	latitude: number | undefined;
	tax_rule: TaxRuleInput | undefined;
};
