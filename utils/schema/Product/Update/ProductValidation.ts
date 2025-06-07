import { z } from 'zod';

const Price = z.object({
	id: z.number().optional(),
	currency_code: z.string(),
	orig_sell_price: z.number(),
	cost_price: z.number().optional(),
	sale_price: z.number().optional(),
});

const Category = z.object({ code: z.string().optional(), name: z.string().optional() });

const Tag = z.object({ id: z.number().optional(), value: z.string().optional() });

const OptionValues = z.object({ id: z.number().optional(), option_id: z.number().optional(), value: z.string().optional() });

const Option = z.object({ id: z.number().optional(), name: z.string().optional(), values: z.array(OptionValues).optional() });

const Variant = z.object({
	variant_code: z.string().optional().nullable(),
	product_code: z.string().optional().nullable(),
	name: z.string().optional().nullable(),
	sku: z.string().optional().nullable(),
	ean: z.string().optional().nullable(),
	upc: z.string().optional().nullable(),
	barcode: z.string().optional().nullable(),
	hs_code: z.string().optional().nullable(),
	inventory_quantity: z.number().optional().nullable(),
	allow_backorder: z.boolean().optional().nullable(),
	manage_inventory: z.boolean().optional().nullable(),
	weight: z.number().optional().nullable(),
	length: z.number().optional().nullable(),
	height: z.number().optional().nullable(),
	width: z.number().optional().nullable(),
	origin_country: z.string().optional().nullable(),
	material: z.string().optional().nullable(),
	price_types: z.array(Price).optional().nullable(),
	options: z.array(OptionValues).optional().nullable(),
});

export const UpdateProductValidation = z.object({
	code: z.string().max(16),
	name: z.string(),
	short_desc: z.string().optional().nullable(),
	long_desc: z.string().optional().nullable(),
	is_active: z.boolean().default(true),
	status: z.string(),
	// categories
	categories: z.array(Category).optional().nullable(),
	// tags
	tags: z.array(Tag).optional().nullable(),
	// price_types
	price_types: z.array(Price).optional().nullable(),
	// options
	options: z.array(Option).optional().nullable(),
	// variants
	variants: z.array(Variant).optional().nullable(),
	// type
	type: z.number().default(1),
});
