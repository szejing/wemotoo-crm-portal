import type { DiscountRuleType } from 'wemotoo-common';

export type DiscountSelectMenuRow = {
	code: string;
	isNone: boolean;
	description: string;
	disc_type: DiscountRuleType | null;
	disc_value: number;
	searchText: string;
};
