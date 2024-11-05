import { z } from 'zod';

export const CreateProductValidation = z.object({
	code: z.string().max(10),
	name: z.string(),
	subtitle: z.string(),
	description: z.string().optional(),
	is_active: z.boolean().default(true),
	is_service: z.boolean().default(false),
	// price details
	price: z.object({
		currency: z.string(),
		origSellPrice: z.number(),
		costPrice: z.number().optional(),
		salePrice: z.number().optional(),
	}),
});
