import type { Discount } from '~/utils/types/discount';

export type DiscountResp = {
	discount: Discount;
};

export type DiscountsResp = {
	count: number;
	discounts: Discount[];
};
