import type { ProductStatus } from 'wemotoo-common';
import type { PriceInput } from '../price';
import type { ProductOptionInput, ProductVariantInput } from '../product';
import type { Image } from '../image';

export type ProductCreate = {
	code?: string;
	name: string;
	short_desc?: string;
	long_desc?: string;
	is_discountable: boolean;
	is_giftcard: boolean;
	is_active: boolean;
	status: ProductStatus;

	// Relations (using codes/IDs)
	brand_codes?: string[];
	category_codes: string[];
	tag_ids?: number[];
	type_id: number;

	// File uploads
	thumbnail?: File | Image;
	images?: (File | Image)[];

	// Nested inputs
	price_types?: PriceInput[];
	options?: ProductOptionInput[];
	variants?: ProductVariantInput[];

	metadata?: Record<string, unknown>;
};
