import type { Category } from '../category';

export type CategoryCreate = {
	// name
	name: string | undefined;

	// id
	code: string | undefined;

	// description
	description?: string | undefined;

	is_active?: true;

	is_internal?: false;

	// images
	images?: string[] | undefined;

	// thumbnail
	thumbnail?: string | undefined;

	// parent_category
	parent_category?: Category | undefined;
};
