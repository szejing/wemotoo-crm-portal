type SummOrderTxnDaily = {
	biz_date: string;
	total_orders: number;
	total_qty: number;
	currency_code: string;
};

type SummOrderItemDaily = {
	prod_code: string;
	prod_name: string;
	prod_variant_id?: string;
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
	total_orders: number;
	total_spent: number;
};
