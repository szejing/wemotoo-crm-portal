import { z } from 'zod';

export const UpdateTagValidation = z.object({
	value: z.string({ message: 'Tag is required' }),
	// metadata: z.record(z.unknown()).optional(),
});
