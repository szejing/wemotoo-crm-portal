import { z } from 'zod';

export const CreateOutletValidation = z.object({
	code: z.string(),
	description: z.string(),
	address1: z.string(),
	address2: z.string().optional(),
	address3: z.string().optional(),
	city: z.string(),
	country_code: z.string(),
	state: z.string(),
	postal_code: z.string(),
	longitude: z.number().optional(),
	latitude: z.number().optional(),
});
