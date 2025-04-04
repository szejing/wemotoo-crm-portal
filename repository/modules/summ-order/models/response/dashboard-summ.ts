type SummOrderTxnDaily = {
	biz_date: Date;
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

type SummDaily = {
	biz_date: Date;
	summ_order: SummOrderTxnDaily;
	summ_order_item: SummOrderItemDaily;
};

type SummCustomer = {
	customer_no: Date;
	total_orders: number;
	total_spent: number;
};

export type GetDashboardSummResp = {
	daily_summaries: SummDaily[];
	top_purchased_customers: SummCustomer[];
};
