import type { ProductVariation } from '~/utils/types/product-variation';

export type ProductOptionsResp = {
	count: number;
	productOptions: ProductVariation[];
};
