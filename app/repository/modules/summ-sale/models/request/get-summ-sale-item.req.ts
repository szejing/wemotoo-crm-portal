import type { FilterType, OrderItemStatus, SaleStatus } from 'wemotoo-common';

export type GetSummSaleItemsReq = {
	start_date: string;
	end_date?: string;
	filter_type: FilterType;
	status?: SaleStatus;
	item_status?: OrderItemStatus;
	currency_code?: string;
};
