export type ProductCategory = {
	id: string;
	name: string;
	code: string;
	description?: string | undefined;

	no_of_items: number;

	is_active: boolean;
	images?: string[] | undefined;
	thumbnail?: string | undefined;

	parent_category?: ProductCategory | undefined;
	category_children?: ProductCategory[] | undefined;
};
