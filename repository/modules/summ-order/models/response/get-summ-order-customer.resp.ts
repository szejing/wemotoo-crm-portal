import type { OrderStatus } from 'wemotoo-common';

type SummOrderCustomer = {
	customer_no: string;
	currency_code: string;
	status: OrderStatus;
	email_address: string;
	gross_amt: number;
	net_amt: number;
	disc_amt?: number;
	gross_amt_exc: number;
	net_amt_exc: number;
	tax_amt_inc?: number;
	tax_amt_exc?: number;
	void_amt?: number;
	adj_amt?: number;
	total_orders: number;
	total_qty: number;
	total_voided_qty: number;
};

export type GetSummOrderCustomersResp = {
	summ_order_customers: SummOrderCustomer[];
	total: number;
};
