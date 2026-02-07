import type { MessageResp } from '~/repository/base/base.resp';
import type { Category } from '~/utils/types/category';

export type ProductCategoryResp = MessageResp & {
	category: Category;
};
