import type { OrderStatus } from 'wemotoo-common';
import type { CustomerModel } from '~/utils/models/customer.model';
import type { OrderItemModel } from '~/utils/models/item.model';

type Order = {
	biz_date: string;
	order_no: string;
	user_id: string;
	order_status: OrderStatus;
	gross_amt: number;
	net_amt: number;
	disc_amt: number;
	gross_amt_exc: number;
	net_amt_exc: number;
	disc_amt_exc: number;
	tax_amt_exc: number;
	void_amt: number;
	adj_amt: number;
	total_order_qty: number;
	voided_qty: number;
	ref_no: string;
	remarks: string;
	currency_code: string;
	items: OrderItemModel[];
	customer: CustomerModel;
};

export type GetOrdersResp = {
	orders: Order[];
	total: number;
};

export type GetOrderResp = {
	order: Order;
};

export type UpdateOrderStatusResp = {
	order: Order;
};
