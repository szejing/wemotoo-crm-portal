import type { ProductStatus } from '~/utils/enum/product-status';
import type { ProductOption } from '../product-option';
import type { ProductCategory } from '../product-category';
import type { ProductTag } from '../product-tag';
import type { ProductVariant } from '../product-variant';
import type { ProductPrice } from '../product-price';

export type ProductCreate = {
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
	categories: ProductCategory[] | undefined;

	// tags
	tags: ProductTag[] | undefined;

	// thumbnail
	thumbnail: string | undefined;

	// galleries
	galleries: string[] | undefined;

	// price
	prices: ProductPrice[] | undefined;

	// variants
	options: ProductOption[] | undefined;
	variants: ProductVariant[] | undefined;
};
