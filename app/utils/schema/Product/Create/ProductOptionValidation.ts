import { z } from 'zod';

export const CreateProductOptionValidation = z.object({
	name: z.string({ message: 'Option name is required (eg: Size)' }),
	values: z.array(z.string(), { message: 'Value is required (eg: Small, Medium, Large)' }),
});
