import type { ProductStatus } from '~/utils/enum/product-status';
import type { ProductPrice } from './product-price';

export type ProdCategoryInput = {
	code: string;
};

export type ProdTagInput = {
	id: number;
};

export type ProdOptionValuesInput = {
	id: number;
	value: string;
};

export type ProdOptionInput = {
	id: number;
	name: string;
	values: ProdOptionValuesInput[] | undefined;
};

export type ProdVariantInput = {
	id?: string;
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
	price_types?: ProductPrice[] | undefined;
	options?: ProdOptionInput[];
	metadata?: Record<string, unknown>;
};

export type Product = {
	code: string | undefined;
	name: string | undefined;
	subtitle: string | undefined;
	description: string | undefined;
	is_discountable: boolean;
	is_giftcard: boolean;
	is_active: boolean;
	is_service: boolean;

	status: ProductStatus;

	// categories
	categories: ProdCategoryInput[] | undefined;

	// tags
	tags: ProdTagInput[] | undefined;

	// thumbnail
	thumbnail: string | undefined;

	// galleries
	galleries: string[] | undefined;

	// price
	price_types: ProductPrice[] | undefined;

	// variants
	options: ProdOptionInput[] | undefined;
	variants: ProdVariantInput[] | undefined;
};
