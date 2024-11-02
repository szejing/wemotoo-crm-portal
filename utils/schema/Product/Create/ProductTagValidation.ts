import { z } from 'zod';

export const CreateProductTagValidation = z.object({
	value: z.string(),
	metadata: z.record(z.unknown()).optional(),
});
