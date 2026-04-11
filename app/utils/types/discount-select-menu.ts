import type { DiscountRuleType } from 'wemotoo-common';

export type DiscountSelectMenuRow = {
	code: string;
	isNone: boolean;
	description: string;
	rule_type: DiscountRuleType | null;
	rule_value: number;
	searchText: string;
};
