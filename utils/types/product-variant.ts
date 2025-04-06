import type { ProductOption } from './product-option';
import type { PriceInput } from './price';

export type ProductVariant = {
	variant_code?: string;
	name?: string;
	sku?: string;
	ean?: string;
	upc?: string;
	barcode?: string;
	hs_code?: string;
	inventory_quantity?: number;
	allow_backorder?: boolean;
	manage_inventory?: boolean;
	weight?: number;
	length?: number;
	height?: number;
	width?: number;
	origin_country?: string;
	mid_code?: string;
	material?: string;
	prices?: PriceInput[] | undefined;
	options?: ProductOption[];
	metadata?: Record<string, unknown>;
};
