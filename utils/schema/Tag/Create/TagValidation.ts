import { z } from 'zod';

export const CreateTagValidation = z.object({
	value: z.string(),
	metadata: z.record(z.unknown()).optional(),
});
