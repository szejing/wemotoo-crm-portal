import type { FilterType, OrderStatus } from 'wemotoo-common';

type FilterableOrderProps = {
	order_no?: string;
	customer_no?: string;
	start_date: string;
	end_date?: string;
	status?: OrderStatus;
	filter_type: FilterType;
};

export type GetOrdersReq = FilterableOrderProps & {
	limit?: number;
	offset?: number;
	q?: string;
};
