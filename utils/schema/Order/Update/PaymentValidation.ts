import { z } from 'zod';

export const UpdateOrderPaymentValidation = z.object({
	payment_line: z.number(),
	payment_type_code: z.string(),
	payment_type_desc: z.string(),
	ref_no1: z.string().optional().nullable(),
	ref_no2: z.string().optional().nullable(),
	payment_amount: z.number(),
	local_amount: z.number(),
	currency_code: z.string(),
	external_intg_type: z.number().optional().nullable(),
	metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});
