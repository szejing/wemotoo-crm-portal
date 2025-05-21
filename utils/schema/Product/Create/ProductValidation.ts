import { z } from 'zod';

const Price = z.object({
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
	variant_code: z.string().optional(),
	product_code: z.string().optional(),
	name: z.string().optional(),
	sku: z.string().optional(),
	ean: z.string().optional(),
	upc: z.string().optional(),
	barcode: z.string().optional(),
	hs_code: z.string().optional(),
	inventory_quantity: z.number().optional(),
	allow_backorder: z.boolean().optional(),
	manage_inventory: z.boolean().optional(),
	weight: z.number().optional(),
	length: z.number().optional(),
	height: z.number().optional(),
	width: z.number().optional(),
	origin_country: z.string().optional(),
	mid_code: z.string().optional(),
	material: z.string().optional(),
	price_types: z.array(Price).optional(),
	options: z.array(OptionValues).optional(),
});

export const CreateProductValidation = z.object({
	code: z.string().max(16),
	name: z.string(),
	short_desc: z.string().optional(),
	long_desc: z.string().optional(),
	is_active: z.boolean().default(true),
	status: z.string(),
	// categories
	categories: z.array(Category).optional(),
	// tags
	tags: z.array(Tag).optional(),
	// prices
	price_types: z.array(Price).optional(),
	// options
	options: z.array(Option).optional(),
	// variants
	variants: z.array(Variant).optional(),
	// type
	type: z.number().default(1),
});
