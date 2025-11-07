import type { ProductStatus } from 'wemotoo-common';
import type { Price, PriceInput } from './price';
import type { Category } from './category';
import type { Tag } from './tag';
import type { Brand } from './brand';
import type { Image } from './image';
import type { ProductType } from './product-type';
import type { ProductVariant } from './product-variant';
import type { ProductOption } from './product-option';

// ============================================
// INPUT TYPES (for create/update operations)
// ============================================

export type ProductOptionValueInput = {
	id?: number;
	option_id?: number;
	value: string;
};

export type ProductOptionInput = {
	id?: number;
	name: string;
	values: ProductOptionValueInput[];
};

export type ProductVariantInput = {
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
	price_types?: PriceInput[];
	options?: ProductOptionValueInput[];
	metadata?: Record<string, unknown>;
};

export type ProductInput = {
	code?: string;
	name: string;
	short_desc?: string;
	long_desc?: string;
	is_discountable: boolean;
	is_giftcard: boolean;
	is_active: boolean;
	status: ProductStatus;

	// Relations (using codes/IDs for input)
	brand_codes?: string[];
	category_codes: string[];
	tag_ids?: number[];
	type_id: number;

	// File uploads
	thumbnail?: File;
	images?: File[];

	// Nested inputs
	price_types?: PriceInput[];
	options?: ProductOptionInput[];
	variants?: ProductVariantInput[];

	metadata?: Record<string, unknown>;
};

// Reference type for selections/dropdowns
export type ProductRef = {
	code: string;
	name?: string;
};

// ============================================
// MODEL TYPES (for display/read operations)
// ============================================

export type Product = {
	code: string;
	name: string;
	short_desc?: string;
	long_desc?: string;
	is_discountable: boolean;
	is_giftcard: boolean;
	is_active: boolean;
	status: ProductStatus;

	// Relations (populated objects)
	brands?: Brand[];
	categories?: Category[];
	tags?: Tag[];
	type?: ProductType;

	// Images (URLs from backend)
	thumbnail?: Image;
	images?: Image[];

	// Nested models
	price_types?: Price[];
	options?: ProductOption[];
	variants?: ProductVariant[];

	// Timestamps
	created_at?: string;
	updated_at?: string;

	metadata?: Record<string, unknown>;
};
