export type CategoryCreate = {
	// code
	code: string;

	// description
	description?: string | undefined;

	is_active: boolean;

	is_internal: boolean;

	// images
	images?: File[] | undefined;

	// thumbnail
	thumbnail?: File | undefined;

	// parent_category
	parent_category_code?: string | undefined;
};
