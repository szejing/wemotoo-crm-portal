import { z } from 'zod';

export const CreateProductOptionValidation = z.object({
	name: z.string(),
	values: z.array(z.string()).optional(),
});
