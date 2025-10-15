import type { OrderStatus, PaymentStatus } from 'wemotoo-common';
import type { ItemModel, PaymentModel, CustomerModel } from '~/utils/models';
import type { Currency } from '~/utils/types/currency';

export type Bill = {
	biz_date: string;
	bill_no: string;
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
	total_item_qty: number;
	voided_qty: number;
	ref_no: string;
	remarks: string;
	currency: Currency;
	items: ItemModel[];
	payments: PaymentModel[];
	customer: CustomerModel;
};
