import { z } from 'zod';

export const UpdateOrderPaymentValidation = z.object({
	payment_line: z.number().optional().nullable(),
	payment_date_time: z.date(),
	payment_type_code: z.string(),
	currency_code: z.string(),
	ref_no1: z.string().optional().nullable(),
	ref_no2: z.string().optional().nullable(),
	payment_amt: z.number(),
	metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});
