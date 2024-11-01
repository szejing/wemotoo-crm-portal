export type ProductCategory = {
	id: string;
	name: string;
	code: string;
	description?: string | undefined;

	total_items: number;

	is_active: boolean;
	images?: string[] | undefined;
	thumbnail?: string | undefined;

	parent_category?: ProductCategory | undefined;
	category_children?: ProductCategory[] | undefined;
};
