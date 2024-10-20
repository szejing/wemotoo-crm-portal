import { z } from 'zod';

export const FilterOrderValidation = z.object({
	orderNo: z.string().optional(),
	customerName: z.string().optional(),
});
