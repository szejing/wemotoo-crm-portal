import type { OrderItemStatus, OrderStatus } from 'wemotoo-common';

type SummOrderItem = {
	biz_date: Date;
	currency_code: string;
	order_status: OrderStatus;
	item_status: OrderItemStatus;
	prod_code: string;
	prod_name: string;
	prod_variant_id?: string;
	prod_variant_name?: string;
	parent_prod_code?: string;
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

export type GetSummOrderItemsResp = {
	summ_order_items: SummOrderItem[];
	total: number;
};
