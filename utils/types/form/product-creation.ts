import type { ProductStatus } from '~/utils/enum/product-status';

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
	categories: [];

	// tags
	tags: [];

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
	options: [];
	variants: [];
};
