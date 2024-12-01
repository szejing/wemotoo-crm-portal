import { z } from 'zod';

const Price = z.object({
	currency: z.string(),
	orig_sell_price: z.number(),
	cost_price: z.number().optional(),
	sale_price: z.number().optional(),
});

const Category = z.object({ code: z.string().optional(), name: z.string().optional() });

const Tag = z.object({ id: z.number().optional(), value: z.string().optional() });

const OptionValues = z.object({ id: z.number().optional(), value: z.string().optional() });

const Option = z.object({ id: z.number().optional(), name: z.string().optional(), values: z.array(OptionValues).optional() });

const Variant = z.object({
	id: z.string().optional(),
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
	prices: z.array(Price).optional(),
	options: z.array(Option).optional(),
});

export const CreateProductValidation = z.object({
	code: z.string().max(16),
	name: z.string(),
	subtitle: z.string().optional(),
	description: z.string().optional(),
	is_active: z.boolean().default(true),
	is_service: z.boolean().default(false),
	status: z.string(),
	thumbnail: z.string().optional(),
	galleries: z.array(z.string()).optional(),
	// categories
	categories: z.array(Category).optional(),
	// tags
	tags: z.array(Tag).optional(),
	// prices
	prices: z.array(Price).optional(),
	// options
	options: z.array(Option).optional(),
	// variants
	variants: z.array(Variant).optional(),
});
