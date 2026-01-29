import type { Product } from '~/utils/types/product';

export type ProductResp = {
	product: Product;
};

export type ProductsResp = {
	count: number;
	products: Product[];
};
