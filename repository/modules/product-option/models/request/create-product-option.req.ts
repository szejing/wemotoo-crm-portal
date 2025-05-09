import type { ProductOptionValue } from '~/utils/types/product-option-value';

export type CreateProductOptionReq = {
	name: string;
	values: ProductOptionValue[];
};
