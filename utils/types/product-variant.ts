import type { ProductOption } from './product-option';
import type { ProductPrice } from './product-price';

export type ProductVariant = {
	id?: string;

	title?: string;

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

	prices?: ProductPrice[] | undefined;

	options?: ProductOption[];

	metadata?: Record<string, unknown>;
};
