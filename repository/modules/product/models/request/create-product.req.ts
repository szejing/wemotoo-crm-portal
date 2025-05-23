import type { ProductStatus } from 'wemotoo-common';
import type { ImageReq } from '~/repository/modules/image/models/request/image.req';
import type { CategoryInput } from '~/utils/types/category';
import type { PriceInput } from '~/utils/types/price';
import type { ProdOptionInput, ProdVariantInput } from '~/utils/types/product';
import type { TagInput } from '~/utils/types/tag';

export type CreateProductReq = {
	code?: string | undefined;
	name: string | undefined;
	short_desc: string | undefined;
	long_desc: string | undefined;
	is_discountable: boolean;
	is_giftcard: boolean;
	is_active: boolean;

	status: ProductStatus;

	// categories
	categories: CategoryInput[] | undefined;

	// tags
	tags: TagInput[] | undefined;

	// thumbnail
	thumbnail: ImageReq | undefined;

	// images
	images: ImageReq[] | undefined;

	// price
	price_types: PriceInput[] | undefined;

	// variants
	options: ProdOptionInput[] | undefined;
	variants: ProdVariantInput[] | undefined;

	// type
	type: number;
};
