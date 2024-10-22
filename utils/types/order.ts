export type Order = {
	id: string;

	order_no: string;

	status: string;

	created_at: string;

	updated_at: string;

	total: number;

	shipping: number;

	tax: number;

	subtotal: number;

	discount: number;

	grand_total: number;
};
