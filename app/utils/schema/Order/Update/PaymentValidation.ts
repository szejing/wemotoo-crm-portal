import { z } from 'zod';
import type { TranslateFn } from '../../Auth/LoginValidation';

export function createUpdateOrderPaymentValidation(t: TranslateFn) {
	return z.object({
		payment_line: z.number().optional().nullable(),
		payment_date_time: z.date(),
		payment_type_code: z.string({ message: t('validation.order.paymentTypeCodeRequired') }),
		currency_code: z.string({ message: t('validation.order.currencyCodeRequired') }),
		ref_no1: z.string().optional().nullable(),
		ref_no2: z.string().optional().nullable(),
		payment_amt: z.number({ message: t('validation.order.paymentAmtRequired') }),
		metadata: z.record(z.string(), z.unknown()).optional().nullable(),
	});
}

/** @deprecated Use createUpdateOrderPaymentValidation(t) for i18n. */
export const UpdateOrderPaymentValidation = z.object({
	payment_line: z.number().optional().nullable(),
	payment_date_time: z.date(),
	payment_type_code: z.string({ message: 'Payment type code is required' }),
	currency_code: z.string({ message: 'Currency code is required' }),
	ref_no1: z.string().optional().nullable(),
	ref_no2: z.string().optional().nullable(),
	payment_amt: z.number({ message: 'Payment amount is required' }),
	metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});
