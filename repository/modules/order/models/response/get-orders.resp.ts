import type { Currency } from '~/utils/types/currency';
import type { OrderStatus, PaymentStatus } from 'wemotoo-common';
import type { ItemModel, PaymentModel, CustomerModel } from '~/utils/models';
import type { TaxModel } from '~/utils/models/tax.model';

export type OrderHistory = {
	biz_date: string;
	order_date_time: Date;
	transaction_no: string;
	bill_no?: string;
	type: 'order' | 'sale';
	total_qty: number;
	order_no: string;
	doc_no: string;
	status: OrderStatus;
	payment_status: PaymentStatus;
	customer_no: string;
	gross_amt: number;
	net_amt: number;
	net_total: number;
	disc_amt?: number;
	gross_amt_exc: number;
	net_amt_exc: number;
	disc_amt_exc?: number;
	tax_amt_inc?: number;
	tax_amt_exc?: number;
	void_amt?: number;
	adj_amt?: number;
	total_order_qty: number;
	voided_qty: number;
	ref_no?: string;
	remarks?: string;
	currency: Currency;
	items: ItemModel[];
	payments: PaymentModel[];
	customer: CustomerModel;
	taxes: TaxModel[];
	created_at: Date;
};

export type GetOrdersResp = {
	data: OrderHistory[];
	total: number;
};
