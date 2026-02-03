import { z } from 'zod';
import type { TranslateFn } from '../../Auth/LoginValidation';
import { createUpdateAppointmentValidation, UpdateAppointmentValidation } from '../../Appointment/Update/AppointmentValidation';

export function createUpdateOrderItemValidation(t: TranslateFn) {
	const UpdateAppointmentValidation = createUpdateAppointmentValidation(t);
	return z.object({
		item_line: z.number(),
		status: z.string({ message: t('validation.order.itemStatusRequired') }),
		parent_item_line: z.number(),
		prod_code: z.string({ message: t('validation.order.prodCodeRequired') }),
		prod_name: z.string({ message: t('validation.order.prodNameRequired') }),
		prod_variant_code: z.string().optional().nullable(),
		prod_variant_name: z.string().optional().nullable(),
		prod_variant_sku: z.string().optional().nullable(),
		currency_code: z.string({ message: t('validation.order.currencyCodeRequired') }),
		qty: z.number({ message: t('validation.order.qtyRequired') }),
		unit_sell_price: z.number({ message: t('validation.order.unitSellPriceRequired') }),
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
}

/** @deprecated Use createUpdateOrderItemValidation(t) for i18n. */
export const UpdateOrderItemValidation = z.object({
	item_line: z.number(),
	status: z.string({ message: 'Item status is required' }),
	parent_item_line: z.number(),
	prod_code: z.string({ message: 'Product code is required' }),
	prod_name: z.string({ message: 'Product name is required' }),
	prod_variant_code: z.string().optional().nullable(),
	prod_variant_name: z.string().optional().nullable(),
	prod_variant_sku: z.string().optional().nullable(),
	currency_code: z.string({ message: 'Currency code is required' }),
	qty: z.number({ message: 'Quantity is required' }),
	unit_sell_price: z.number({ message: 'Unit sell price is required' }),
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
