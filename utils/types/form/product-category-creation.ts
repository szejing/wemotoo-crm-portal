import type { ProductCategory } from '../product-category';

export type ProductCategoryCreate = {
	// name
	name: string | undefined;

	// code
	code: string | undefined;

	// description
	description?: string | undefined;

	// images
	images?: string[] | undefined;

	// thumbnail
	thumbnail?: string | undefined;

	// parent_category
	parent_category?: ProductCategory | undefined;
};
