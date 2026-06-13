import type { FilterType, OrderItemStatus } from 'yeppi-common';

export type GetSummSaleItemsReq = {
	start_date: string;
	end_date?: string;
	filter_type: FilterType;
	item_status?: OrderItemStatus;
	currency_code?: string;
};
