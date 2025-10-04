import { z } from 'zod';

export const UpdateBrandValidation = z.object({
	code: z.string({ message: 'Code is required' }).max(16, 'Max. 16 characters'),
	description: z.string({ message: 'Description is required' }),
	is_active: z.boolean().default(true),
});
