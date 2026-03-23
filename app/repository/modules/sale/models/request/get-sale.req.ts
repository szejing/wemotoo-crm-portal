import type { FilterType, OrderStatus } from 'wemotoo-common';

type FilterableSaleProps = {
	order_no?: string;
	customer_no?: string;
	start_date: string;
	end_date?: string;
	status?: OrderStatus;
	filter_type: FilterType;
};

export type GetSalesReq = FilterableSaleProps & {
	limit?: number;
	offset?: number;
	q?: string;
};
