import { z } from 'zod';

export const CreateTagValidation = z.object({
	value: z.string({ message: 'Tag is required' }),
	metadata: z.record(z.string(), z.unknown()).optional(),
});
