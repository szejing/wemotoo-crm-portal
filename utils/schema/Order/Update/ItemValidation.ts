import { z } from 'zod';
import { UpdateAppointmentValidation } from '../../Appointment/Update/AppointmentValidation';

export const UpdateOrderItemValidation = z.object({
	item_line: z.number(),
	status: z.string(),
	parent_item_line: z.number(),
	prod_code: z.string(),
	prod_name: z.string(),
	prod_variant_code: z.string().optional().nullable(),
	prod_variant_name: z.string().optional().nullable(),
	prod_variant_sku: z.string().optional().nullable(),
	currency_code: z.string(),
	qty: z.number(),
	unit_sell_price: z.number(),
	orig_sell_price: z.number().optional().nullable(),
	gross_amt: z.number().optional().nullable(),
	disc_amt: z.number().optional().nullable(),
	net_amt: z.number().optional().nullable(),
	gross_amt_exc: z.number().optional().nullable(),
	disc_amt_exc: z.number().optional().nullable(),
	net_amt_exc: z.number().optional().nullable(),
	tax_amt_inc: z.number().optional().nullable(),
	tax_amt_exc: z.number().optional().nullable(),
	adj_amt: z.number().optional().nullable(),
	appointment: UpdateAppointmentValidation.optional().nullable(),
});
