import type { OrderStatus } from 'wemotoo-common';

type FilterableOrderProps = {
	order_no?: string;
	customer_no?: string;
	date_from?: string;
	date_to?: string;
	status?: OrderStatus;
};

export type GetOrdersReq = FilterableOrderProps & {
	limit?: number;
	offset?: number;
};
