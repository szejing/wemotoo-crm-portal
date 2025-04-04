import type { FilterType, OrderItemStatus, OrderStatus } from 'wemotoo-common';

export type GetSummOrderItemsReq = {
	start_date: Date;
	end_date: Date;
	filter_type: FilterType;
	order_status?: OrderStatus;
	item_status?: OrderItemStatus;
	currency_code?: string;
};
