import type { ProductStatus } from 'wemotoo-common';
import type { TagInput } from '../tag';
import type { CategoryInput } from '../category';
import type { PriceInput } from '../price';
import type { ProdOptionInput, ProdVariantInput } from '../product';
import type { BrandInput } from '../brand';
import type { Image } from '../image';

export type ProductCreate = {
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

	// type
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
	metadata: Record<string, any> | undefined;
};
