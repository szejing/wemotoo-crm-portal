import type { ProductStatus } from 'wemotoo-common';
import type { PriceInput } from './price';
import type { CategoryInput } from './category';
import type { TagInput } from './tag';
import type { BrandInput } from './brand';
import type { Image } from './image';

export type ProdVariantOptionValuesInput = {
	id: number;
	option_id?: number;
	value?: string | undefined;
};

export type ProdOptionValuesInput = {
	id: number;
	option_id?: number;
	value?: string | undefined;
};

export type ProdOptionInput = {
	id: number;
	name: string;
	value?: string | undefined;
	values: ProdOptionValuesInput[] | undefined;
};

export type ProdVariantInput = {
	variant_code?: string;
	product_code?: string;
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
	material?: string;
	price_types?: PriceInput[] | undefined;
	options?: ProdOptionValuesInput[];
	metadata?: Record<string, unknown>;
};

export type Product = {
	code: string | undefined;
	name: string | undefined;
	short_desc: string | undefined;
	long_desc: string | undefined;
	is_discountable: boolean;
	is_giftcard: boolean;
	is_active: boolean;

	status: ProductStatus;

	// brands
	brands: BrandInput[] | undefined;

	// categories
	categories: CategoryInput[] | undefined;

	// product types
	type: number;

	// tags
	tags: TagInput[] | undefined;

	// thumbnail
	thumbnail: File | Image | undefined;

	// images
	images: File[] | Image[] | undefined;

	// price
	price_types: PriceInput[] | undefined;

	// variants
	options: ProdOptionInput[] | undefined;
	variants: ProdVariantInput[] | undefined;

	// metadata
	metadata: Record<string, unknown> | undefined;
};
