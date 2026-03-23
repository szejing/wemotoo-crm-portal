import type { FilterType, OrderItemStatus } from 'wemotoo-common';

export type GetSummSaleItemsReq = {
	start_date: string;
	end_date?: string;
	filter_type: FilterType;
	item_status?: OrderItemStatus;
	currency_code?: string;
};
