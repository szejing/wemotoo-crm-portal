import type { Image } from './image';

export type CategoryInput = {
	code: string;
	name?: string;
};

export type Category = {
	code: string;
	name: string;
	description?: string | undefined;
	slug?: string | undefined;

	is_active: boolean;
	is_internal: boolean;

	images?: Image[] | undefined;
	thumbnail?: Image | undefined;

	parent_category_code?: string | undefined;
	parent_category?: Category | undefined;
	category_children?: Category[] | undefined;
};
