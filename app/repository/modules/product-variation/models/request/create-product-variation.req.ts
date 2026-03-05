import type { ProductOptionInput } from '~/utils/types/product-option';

export type CreateProductOptionReq = {
	name: string;
	options: ProductOptionInput[];
};
