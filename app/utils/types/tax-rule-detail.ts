import type { Tax } from './tax';
import type { TaxCondition } from './tax-condition';

export type TaxRuleDetail = {
	id: number;
	description: string;
	tax: Tax | undefined;
	tax_code: string;
	tax_condition: TaxCondition | undefined;
};
