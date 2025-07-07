import { z } from 'zod';

export const UpdateOutletValidation = z.object({
	description: z.string(),
	address1: z.string(),
	address2: z.string().optional().nullable(),
	address3: z.string().optional().nullable(),
	city: z.string(),
	country_code: z.string(),
	state: z.string(),
	postal_code: z.string(),
	longitude: z.number().optional().nullable(),
	latitude: z.number().optional().nullable(),
	tax_rule: z.string().optional().nullable(),
});
