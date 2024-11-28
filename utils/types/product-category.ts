export type ProductCategory = {
	code: string;
	name: string;
	description?: string | undefined;
	slug?: string | undefined;

	total_items: number;

	is_active: boolean;
	is_internal: boolean;

	images?: string[] | undefined;
	thumbnail?: string | undefined;

	parent_category_code?: string | undefined;
	parent_category?: ProductCategory | undefined;
	category_children?: ProductCategory[] | undefined;
};
