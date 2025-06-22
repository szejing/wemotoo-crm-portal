type SummOrderTxnDaily_ = {
	biz_date: string;
	total_orders: number;
	total_qty: number;
	currency_code: string;
};

type SummOrderItemDaily_ = {
	prod_code: string;
	prod_name: string;
	prod_variant_code?: string;
	prod_variant_name?: string;
	total_qty: number;
	total_net_amt: number;
	currency_code: string;
};

type SummDaily_ = {
	biz_date: string;
	summ_order: SummOrderTxnDaily_;
	summ_order_item: SummOrderItemDaily_;
};

type SummCustomer_ = {
	customer_no: string;
	customer_name: string;
	total_orders: number;
	total_spent: number;
};

type SummProduct_ = {
	prod_code: string;
	prod_name: string;
	total_qty: number;
	total_net_amt: number;
};

export type GetDashboardSummResp = {
	daily_summaries: SummDaily_[];
	top_purchased_customers: SummCustomer_[];
	top_purchased_products: SummProduct_[];
	new_orders: number;
	new_customers: number;
	total_sales_amt: number;
};
