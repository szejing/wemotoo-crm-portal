import type { OrderItemStatus } from 'wemotoo-common';

export type OrderItemModel = {
	order_line: number;
	parent_order_line: number;
	prod_code: string;
	prod_name: string;
	prod_variant_code: string;
	prod_variant_name: string;
	prod_variant_sku: string;
	currency_code: string;
	order_qty: number;
	unit_sell_price: number;
	orig_sell_price: number;
	gross_amt: number;
	disc_amt?: number;
	net_amt: number;
	gross_amt_exc: number;
	disc_amt_exc?: number;
	net_amt_exc: number;
	tax_amt_inc?: number;
	tax_amt_exc?: number;
	adj_amt?: number;
	status: OrderItemStatus;
};
