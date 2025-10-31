// Input type for create/update operations
export type PriceInput = {
	id?: number;
	currency_code: string;
	orig_sell_price: number;
	cost_price?: number;
	sale_price?: number;
};

// Model type for display/read operations
export type Price = {
	id: number;
	currency_code: string;
	orig_sell_price: number;
	cost_price?: number;
	sale_price?: number;
	created_at?: string;
	updated_at?: string;
};
