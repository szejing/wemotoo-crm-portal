import type { TaxRule } from './tax-rule';

export type TaxGroup = {
	code: string;
	description: string;
	tax_rules: TaxRule[];
};
