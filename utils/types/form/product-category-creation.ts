import type { ProductCategory } from '../product-category';

export type ProductCategoryCreate = {
	// name
	name: string | undefined;

	// id
	id: string | undefined;

	// description
	description?: string | undefined;

	is_active?: true;

	is_internal?: false;

	// images
	images?: string[] | undefined;

	// thumbnail
	thumbnail?: string | undefined;

	// parent_category
	parent_category?: ProductCategory | undefined;
};
