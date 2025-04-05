type SummOrderTxnDaily_ = {
	biz_date: Date;
	total_orders: number;
	total_qty: number;
	currency_code: string;
};

type SummOrderItemDaily_ = {
	prod_code: string;
	prod_name: string;
	prod_variant_id?: string;
	prod_variant_name?: string;
	total_qty: number;
	total_net_amt: number;
	currency_code: string;
};

type SummDaily_ = {
	biz_date: Date;
	summ_order: SummOrderTxnDaily_;
	summ_order_item: SummOrderItemDaily_;
};

type SummCustomer_ = {
	customer_no: Date;
	total_orders: number;
	total_spent: number;
};

export type GetDashboardSummResp = {
	daily_summaries: SummDaily_[];
	top_purchased_customers: SummCustomer_[];
};
