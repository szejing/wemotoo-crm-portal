import { z } from 'zod';

export const UpdateTagValidation = z.object({
	value: z.string().min(1),
	// metadata: z.record(z.unknown()).optional(),
});
