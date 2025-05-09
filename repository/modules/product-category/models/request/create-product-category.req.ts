export type CreateProductCategoryReq = {
	code: string;
	name: string;
	description: string | null;
	slug: string | null;
	is_internal: boolean | null;
	is_active: boolean | null;
	images: string[] | null;
	thumbnail: string | null;
	parent_category_code: string | null;
};
