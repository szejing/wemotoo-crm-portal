import { z } from 'zod';

export const CreateBrandValidation = z.object({
	code: z.string().min(1, 'Code is required').max(16, 'Max. 16 characters'),
	description: z.string({ message: 'Description is required' }),
	is_active: z.boolean().default(true),
});
