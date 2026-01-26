import type { TaxRule } from '~/utils/types/tax-rule';

export type TaxRulesResp = {
	count: number;
	tax_rules: TaxRule[];
};
