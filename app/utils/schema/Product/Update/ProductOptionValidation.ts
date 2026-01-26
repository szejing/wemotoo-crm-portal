import { z } from 'zod';

export const UpdateProductOptionValidation = z.object({
	id: z.string().optional(),
	name: z.string({ message: 'Product option name is required' }),
	values: z
		.array(
			z.object({
				id: z.number().optional().nullable(),
				value: z.string().min(1),
				metadata: z.record(z.string(), z.unknown()).optional().nullable(),
			}),
		)
		.optional(),

	// values: z.array(z.string()).optional(),
});
