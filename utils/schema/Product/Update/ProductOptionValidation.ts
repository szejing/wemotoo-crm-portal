import { z } from 'zod';

export const UpdateProductOptionValidation = z.object({
	name: z.string().optional(),
	values: z.array(z.string()).optional(),
});
