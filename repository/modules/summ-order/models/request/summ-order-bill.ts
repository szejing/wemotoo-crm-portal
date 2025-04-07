import type { FilterType, OrderStatus } from 'wemotoo-common';

export type GetSummOrderBillsReq = {
	start_date: string;
	end_date?: string;
	filter_type: FilterType;
	order_status?: OrderStatus;
	currency_code?: string;
};
