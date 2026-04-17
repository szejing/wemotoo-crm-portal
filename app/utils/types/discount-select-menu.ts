import type { DiscountType } from 'wemotoo-common';

export type DiscountSelectMenuRow = {
	code: string;
	isNone: boolean;
	description: string;
	disc_type: DiscountType | null;
	disc_value: number;
	searchText: string;
};
