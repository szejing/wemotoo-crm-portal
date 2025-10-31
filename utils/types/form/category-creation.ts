export type CategoryCreate = {
	code: string;
	description?: string;
	is_active: boolean;
	is_internal: boolean;
	images?: File[];
	thumbnail?: File;
	parent_category_code?: string;
};
