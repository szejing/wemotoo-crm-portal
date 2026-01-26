import type { TaxRuleDetail } from './tax-rule-detail';

export type TaxRuleInput = {
	code: string;
};

export type TaxRule = {
	code: string;
	description: string;
	details: TaxRuleDetail[];
};
