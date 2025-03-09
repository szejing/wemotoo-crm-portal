import { z } from 'zod';

const Price = z.object({
	currency_code: z.string(),
	orig_sell_price: z.number(),
	cost_price: z.number().optional(),
	sale_price: z.number().optional(),
});

const Category = z.object({ code: z.string().optional(), name: z.string().optional() });

const Tag = z.object({ id: z.number().optional(), value: z.string().optional() });

export const CreateMaintenanceValidation = z.object({
	code: z.string().max(16),
	name: z.string(),
	short_desc: z.string().optional(),
	long_desc: z.string().optional(),
	is_active: z.boolean().default(true),
	status: z.string(),
	thumbnail: z.string().optional(),
	galleries: z.array(z.string()).optional(),
	// categories
	categories: z.array(Category).optional(),
	// tags
	tags: z.array(Tag).optional(),
	// prices
	price_types: z.array(Price).optional(),
});
