import type { OrderStatus, PaymentStatus } from 'wemotoo-common';
import type { ItemModel, PaymentModel, CustomerModel } from '~/utils/models';

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
	items: ItemModel[];
	payments: PaymentModel[];
	customer: CustomerModel;
};
