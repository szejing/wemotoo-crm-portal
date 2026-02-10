import type { Image } from './image';
import type { Product } from './product';

export type CategoryInput = {
	code: string;
};

export type Category = {
	code: string;
	description?: string | undefined;
	slug?: string | undefined;

	is_active?: boolean;
	is_internal?: boolean;

	images?: Image[] | undefined;
	thumbnail?: Image | undefined;

	parent_category_code?: string | null;
	parent_category?: Category | undefined;
	children?: Category[] | undefined;
	category_children?: Category[] | undefined;

	products?: Product[] | undefined;

	total_products?: number;
};
