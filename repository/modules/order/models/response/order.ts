import type { OrderItemStatus } from 'wemotoo-common';

type OrderCustomer = {
	customer_no: string;
	user_id: string;
	email_address: string;
	phone_no: string;
	ic_no: string;
	date_of_birth: Date;
	ref_no1: string;
	ref_no2: string;
	s_address1: string;
	s_address2: string;
	s_address3: string;
	s_city: string;
	s_country_code: string;
	s_state: string;
	s_postal_code: string;
	b_address1: string;
	b_address2: string;
	b_address3: string;
	b_city: string;
	b_country_code: string;
	b_state: string;
	b_postal_code: string;
};

type OrderItem = {
	order_line: number;
	parent_order_line: number;
	prod_code: string;
	prod_name: string;
	prod_variant_id: string;
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
type Order = {
	order_no: string;
	user_id: string;
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
	ref_no: string;
	remarks: string;
	currency_code: string;
	items: OrderItem[];
	customer: OrderCustomer;
};

export type GetOrdersResp = {
	orders: Order[];
};

export type GetOrderResp = {
	order: Order;
};
