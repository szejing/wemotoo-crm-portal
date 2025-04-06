import { z } from 'zod';

export const FilterSummOrderValidation = z.object({
	startDate: z.string(),
	endDate: z.string(),
	filterType: z.string(),
});
