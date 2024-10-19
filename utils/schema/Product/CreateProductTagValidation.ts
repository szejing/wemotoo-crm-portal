import { z } from 'zod';

export const CreateProductTagValidation = z.object({
	name: z.string(),
	metadata: z.record(z.unknown()).optional(),
});
