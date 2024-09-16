import { z } from 'zod';

export const CustomerFilterValidation = z.object({
	name: z.string().optional(),
	email: z.string().optional(),
	phone: z.string().optional(),
	postal: z.string().optional(),
	country: z.string().optional(),
	status: z.array(z.string()).optional(),
});
