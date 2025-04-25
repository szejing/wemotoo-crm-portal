import { z } from 'zod';

export const UpdateOrderItemValidation = z.object({
	item: z.object({
		order_line: z.number(),
		status: z.string(),
		parent_order_line: z.number(),
		prod_code: z.string(),
		prod_name: z.string(),
		prod_variant_id: z.string().optional().nullable(),
		prod_variant_name: z.string().optional().nullable(),
		prod_variant_sku: z.string().optional().nullable(),
		currency_code: z.string(),
		order_qty: z.number(),
		unit_sell_price: z.number(),
		orig_sell_price: z.number(),
		gross_amt: z.number(),
		disc_amt: z.number().optional().nullable(),
		net_amt: z.number(),
		gross_amt_exc: z.number(),
		disc_amt_exc: z.number().optional().nullable(),
		net_amt_exc: z.number(),
		tax_amt_inc: z.number().optional().nullable(),
		tax_amt_exc: z.number().optional().nullable(),
		adj_amt: z.number().optional().nullable(),
	}),
});
