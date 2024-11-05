import { z } from 'zod';

export const UpdateProductTagValidation = z.object({
	value: z.string().min(1),
	// metadata: z.record(z.unknown()).optional(),
});
