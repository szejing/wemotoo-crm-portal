import type { OrderItemStatus, OrderStatus, PaymentStatus } from 'wemotoo-common';
import type { AddressModel } from '~/utils/models/customer.model';
import type { Appointment } from './appointment';

type OrderCustomerDto_ = {
	customer_no: string;
	name: string;
	email_address: string;
	phone_no: string;
	dial_code: string;
	ref_no1?: string;
	ref_no2?: string;
	shipping_address: AddressModel;
	billing_address: AddressModel;
};

type OrderItemDto_ = {
	item_line: number;
	parent_item_line: number;
	prod_code: string;
	prod_name: string;
	prod_variant_code?: string;
	prod_variant_name?: string;
	prod_variant_sku?: string;
	currency_code: string;
	qty: number;
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
	appointment?: Appointment;
};

type OrderPaymentDto_ = {
	payment_line: number;
	payment_date_time: Date;
	payment_type_code: string;
	payment_type_desc: string;
	ref_no1: string;
	ref_no2: string;
	payment_amt: number;
	local_amt: number;
	currency_code: string;
	external_intg_type: number;
	metadata: Record<string, unknown>;
};

export type Order = {
	biz_date: string;
	order_date_time: Date;
	order_no: string;
	doc_no: string;
	customer_no: string;
	status: OrderStatus;
	payment_status: PaymentStatus;
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
	items: OrderItemDto_[];
	payments: OrderPaymentDto_[];
	customer: OrderCustomerDto_;
};
