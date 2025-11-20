import type { OrderStatus, PaymentStatus } from 'wemotoo-common';
import type { ItemModel, PaymentModel, CustomerModel } from '~/utils/models';
import type { TaxModel } from '~/utils/models/tax.model';
import type { Currency } from '~/utils/types/currency';

type Order = {
	biz_date: string;
	order_date_time: string;
	order_no: string;
	trace_no: string;
	customer_no: string;
	status: OrderStatus;
	payment_status: PaymentStatus;
	gross_amt: number;
	net_amt: number;
	net_total: number;
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
	currency: Currency;
	items: ItemModel[];
	payments: PaymentModel[];
	customer: CustomerModel;
	taxes: TaxModel[];
};

export type GetOrderResp = {
	order: Order;
};
