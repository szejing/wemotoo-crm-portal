import { z } from 'zod';
import type { TranslateFn } from '../../Auth/LoginValidation';

export function UpdateAppointmentValidation(t: TranslateFn) {
	return z.object({
		code: z.string({ message: t('validation.appointment.codeRequired') }),
		date_time: z.union([z.string().datetime(), z.date()]),
		item_line: z.number(),
		cart_no: z.string().optional().nullable(),
		order_no: z.string().optional().nullable(),
		bill_no: z.string().optional().nullable(),
		duration: z.number().optional().nullable(),
		customer_name: z.string({ message: t('validation.appointment.customerNameRequired') }),
		customer_phone: z.string({ message: t('validation.appointment.customerPhoneRequired') }),
		ref_no: z.string().optional().nullable(),
		status: z.string({ message: t('validation.appointment.statusRequired') }),
	});
}
