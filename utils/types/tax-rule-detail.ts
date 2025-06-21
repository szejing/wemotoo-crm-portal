import type { Tax } from './tax';
import type { TaxCondition } from './tax-condition';

export type TaxRuleDetail = {
	id: number;
	description: string;
	tax: Tax;
	tax_condition: TaxCondition;
};
