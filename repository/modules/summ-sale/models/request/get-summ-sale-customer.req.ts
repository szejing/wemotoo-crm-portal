import type { FilterType, SaleStatus } from 'wemotoo-common';

export type GetSummSaleCustomersReq = {
	start_date: string;
	end_date?: string;
	filter_type: FilterType;
	status?: SaleStatus;
	currency_code?: string;
};
