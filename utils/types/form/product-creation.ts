import type { ProductStatus } from 'wemotoo-common';
import type { TagInput } from '../tag';
import type { CategoryInput } from '../category';
import type { PriceInput } from '../price';
import type { ProdOptionInput, ProdVariantInput } from '../product';

export type ProductCreate = {
	code: string | undefined;
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
	thumbnail: File | undefined;

	// images
	images: File[] | undefined;

	// price
	price_types: PriceInput[] | undefined;

	// variants
	options: ProdOptionInput[] | undefined;
	variants: ProdVariantInput[] | undefined;

	// type
	type: number;

	// metadata
	metadata: Record<string, any> | undefined;
};
