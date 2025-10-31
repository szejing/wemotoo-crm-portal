import type { ProductStatus } from 'wemotoo-common';
import type { ImageReq } from '~/repository/modules/image/models/request/image.req';
import type { PriceInput } from '~/utils/types/price';
import type { ProductOptionInput, ProductVariantInput } from '~/utils/types/product';

export type CreateProductReq = {
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

	// Images
	thumbnail?: ImageReq;
	images?: ImageReq[];

	// Nested inputs
	price_types?: PriceInput[];
	options?: ProductOptionInput[];
	variants?: ProductVariantInput[];

	metadata?: Record<string, unknown>;
};
