import type { FilterType, OrderStatus } from 'wemotoo-common';

export type GetSummOrderBillsReq = {
	start_date: string;
	end_date?: string;
	filter_type: FilterType;
	status?: OrderStatus;
	currency_code?: string;
};
