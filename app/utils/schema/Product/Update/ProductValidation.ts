import { z } from 'zod';

export type TranslateFn = (key: string) => string;

function buildPrice(t: TranslateFn) {
	return z.object({
		id: z.number().optional(),
		currency_code: z.string({ message: t('validation.product.currencyCodeRequired') }),
		orig_sell_price: z.number({ message: t('validation.product.origSellPriceRequired') }),
		cost_price: z.number().optional(),
		sale_price: z.number().optional(),
	});
}

const Category = z.object({ code: z.string().optional(), name: z.string().optional() });

const Tag = z.object({ id: z.number().optional(), value: z.string().optional() });

const OptionValues = z.object({ id: z.number().optional(), option_id: z.number().optional(), value: z.string().optional() });

const Option = z.object({ id: z.number().optional(), name: z.string().optional(), values: z.array(OptionValues).optional() });

function buildVariant(t: TranslateFn) {
	const Price = buildPrice(t);
	return z.object({
		variant_code: z.string().optional().nullable(),
		product_code: z.string().optional().nullable(),
		name: z.string().optional().nullable(),
		sku: z.string().optional().nullable(),
		ean: z.string().optional().nullable(),
		upc: z.string().optional().nullable(),
		barcode: z.string().optional().nullable(),
		hs_code: z.string().optional().nullable(),
		inventory_quantity: z.number().optional().nullable(),
		allow_backorder: z.boolean().optional().nullable(),
		manage_inventory: z.boolean().optional().nullable(),
		weight: z.number().optional().nullable(),
		length: z.number().optional().nullable(),
		height: z.number().optional().nullable(),
		width: z.number().optional().nullable(),
		origin_country: z.string().optional().nullable(),
		material: z.string().optional().nullable(),
		price_types: z.array(Price).optional().nullable(),
		options: z.array(OptionValues).optional().nullable(),
	});
}

export function createUpdateProductValidation(t: TranslateFn) {
	const Price = buildPrice(t);
	const Variant = buildVariant(t);
	return z.object({
		code: z.string({ message: t('validation.product.codeRequired') }).max(16, t('validation.product.codeMax16')),
		name: z.string({ message: t('validation.product.nameRequired') }),
		short_desc: z.string().optional().nullable(),
		long_desc: z.string().optional().nullable(),
		is_active: z.boolean().default(true),
		status: z.string({ message: t('validation.product.statusRequired') }),
		categories: z.array(Category).optional().nullable(),
		tags: z.array(Tag).optional().nullable(),
		price_types: z.array(Price).optional().nullable(),
		options: z.array(Option).optional().nullable(),
		variants: z.array(Variant).optional().nullable(),
		type: z.number().default(1),
	});
}

const PriceLegacy = z.object({
	id: z.number().optional(),
	currency_code: z.string({ message: 'Currency code is required' }),
	orig_sell_price: z.number({ message: 'Original sell price is required' }),
	cost_price: z.number().optional(),
	sale_price: z.number().optional(),
});

const VariantLegacy = z.object({
	variant_code: z.string().optional().nullable(),
	product_code: z.string().optional().nullable(),
	name: z.string().optional().nullable(),
	sku: z.string().optional().nullable(),
	ean: z.string().optional().nullable(),
	upc: z.string().optional().nullable(),
	barcode: z.string().optional().nullable(),
	hs_code: z.string().optional().nullable(),
	inventory_quantity: z.number().optional().nullable(),
	allow_backorder: z.boolean().optional().nullable(),
	manage_inventory: z.boolean().optional().nullable(),
	weight: z.number().optional().nullable(),
	length: z.number().optional().nullable(),
	height: z.number().optional().nullable(),
	width: z.number().optional().nullable(),
	origin_country: z.string().optional().nullable(),
	material: z.string().optional().nullable(),
	price_types: z.array(PriceLegacy).optional().nullable(),
	options: z.array(OptionValues).optional().nullable(),
});

/** @deprecated Use createUpdateProductValidation(t) for i18n. */
export const UpdateProductValidation = z.object({
	code: z.string({ message: 'Code is required' }).max(16, 'Max. 16 characters'),
	name: z.string({ message: 'Name is required' }),
	short_desc: z.string().optional().nullable(),
	long_desc: z.string().optional().nullable(),
	is_active: z.boolean().default(true),
	status: z.string({ message: 'Status is required' }),
	categories: z.array(Category).optional().nullable(),
	tags: z.array(Tag).optional().nullable(),
	price_types: z.array(PriceLegacy).optional().nullable(),
	options: z.array(Option).optional().nullable(),
	variants: z.array(VariantLegacy).optional().nullable(),
	type: z.number().default(1),
});
