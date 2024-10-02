import type { ProductStatus } from '~/utils/enum/product-status';
import type { ProductOption } from '../product-option';
import type { ProductCategory } from '../product-category';
import type { ProductTag } from '../product-tag';

export type ProductCreate = {
	code: string | undefined;
	title: string | undefined;
	subtitle: string | undefined;
	description: string | undefined;
	is_discountable: boolean;
	is_giftcard: boolean;
	is_active: boolean;
	is_service: boolean;

	status: ProductStatus;

	// categories
	categories: ProductCategory[] | undefined;

	// tags
	tags: ProductTag[] | undefined;

	// thumbnail
	thumbnail: string | undefined;

	// galleries
	galleries: string[] | undefined;

	// price
	currency: string | undefined;
	origSellPrice: string | undefined;
	costPrice: string | undefined;
	salePrice: string | undefined;

	// variants
	options: ProductOption[] | undefined;
	variants: [];
};
