import type { OrderItemStatus, OrderStatus } from 'wemotoo-common';

type SummOrderTxnDaily = {
	biz_date: string;
	total_orders: number;
	total_qty: number;
	total_net_amt: number;
	currency_code: string;
};

type SummOrderItemDaily = {
	prod_code: string;
	prod_name: string;
	prod_variant_code?: string;
	prod_variant_name?: string;
	total_qty: number;
	total_net_amt: number;
	currency_code: string;
};

export type SummDaily = {
	biz_date: string;
	summ_order: SummOrderTxnDaily;
	summ_order_item: SummOrderItemDaily;
};

export type SummCustomer = {
	customer_no: string;
	customer_name: string;
	total_orders: number;
	total_spent: number;
};

export type SummProduct = {
	prod_code: string;
	prod_name: string;
	total_qty: number;
	total_net_amt: number;
};

export type SummOrderBill = {
	biz_date: Date;
	currency_code: string;
	status: OrderStatus;
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

export type SummOrderItem = {
	biz_date: Date;
	currency_code: string;
	status: OrderStatus;
	item_status: OrderItemStatus;
	prod_code: string;
	prod_name: string;
	prod_variant_code?: string;
	prod_variant_name?: string;
	// parent_prod_code?: string;
	gross_amt: number;
	disc_amt?: number;
	net_amt: number;
	gross_amt_exc: number;
	disc_amt_exc?: number;
	net_amt_exc: number;
	tax_amt_inc?: number;
	tax_amt_exc?: number;
	adj_amt?: number;
	total_orders: number;
	total_qty: number;
};

export type SummOrderCustomer = {
	customer_no: string;
	customer_name: string;
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
