export type SummSaleTxnDaily_ = {
	biz_date: string;
	total_orders: number;
	total_qty: number;
	currency_code: string;
};

export type SummSaleItemDaily_ = {
	prod_code: string;
	prod_name: string;
	prod_variant_code?: string;
	prod_variant_name?: string;
	total_qty: number;
	total_net_amt: number;
	currency_code: string;
};

export type SummDaily_ = {
	biz_date: string;
	summ_sale: SummSaleTxnDaily_;
	summ_sale_item: SummSaleItemDaily_;
};

export type SummCustomer_ = {
	customer_no: string;
	customer_name: string;
	total_orders: number;
	total_spent: number;
};

export type SummProduct_ = {
	prod_code: string;
	prod_name: string;
	total_qty: number;
	total_net_amt: number;
};

export type TotalSaleAmt_ = {
	currency_code: string;
	total_sale_amt: number;
};

export type GetDashboardSummResp = {
	daily_summaries: SummDaily_[];
	top_purchased_customers: SummCustomer_[];
	top_purchased_products: SummProduct_[];
	total_sale_amt: TotalSaleAmt_[];
};
