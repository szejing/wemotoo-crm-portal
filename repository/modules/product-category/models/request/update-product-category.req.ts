import type { ImageReq } from '~/repository/modules/image/models/request/image.req';

export type UpdateProductCategoryReq = {
	description: string;
	is_internal: boolean | undefined;
	is_active: boolean | undefined;
	images: ImageReq[] | undefined;
	thumbnail: ImageReq | undefined;
	parent_category_code: string | undefined;
};
