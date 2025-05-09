import type { FilterType, OrderStatus } from 'wemotoo-common';

export type GetSummSaleCustomersReq = {
	start_date: Date;
	end_date?: Date;
	filter_type: FilterType;
	order_status?: OrderStatus;
	currency_code?: string;
};
