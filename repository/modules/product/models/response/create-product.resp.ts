import type { Product } from '~/utils/types/product';

export type CreateProductResp = {
	count: number;
	products: Product[];
};
