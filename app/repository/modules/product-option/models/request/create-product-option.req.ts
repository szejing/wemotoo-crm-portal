import type { ProductOptionValueInput } from '~/utils/types/product-option-value';

export type CreateProductOptionReq = {
	name: string;
	values: ProductOptionValueInput[];
};
