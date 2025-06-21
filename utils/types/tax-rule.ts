import type { TaxRuleDetail } from './tax-rule-detail';

export type TaxRule = {
	code: string;
	description: string;
	details: TaxRuleDetail[];
};
