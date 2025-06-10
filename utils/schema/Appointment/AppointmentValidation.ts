import { z } from 'zod';

export const AppointmentValidation = z.object({
	code: z.string(),
	date_time: z.date(),
	item_line: z.number(),
	cart_no: z.string().optional().nullable(),
	order_no: z.string().optional().nullable(),
	bill_no: z.string().optional().nullable(),
	duration: z.number().optional().nullable(),
	customer_name: z.string(),
	customer_phone: z.string(),
	ref_no: z.string().optional().nullable(),
	status: z.string(),
});
