import type { FilterType, OrderItemStatus, OrderStatus } from 'wemotoo-common';

export type GetSummOrderItemsReq = {
	start_date: string;
	end_date?: string;
	filter_type: FilterType;
	status?: OrderStatus;
	item_status?: OrderItemStatus;
	currency_code?: string;
};
