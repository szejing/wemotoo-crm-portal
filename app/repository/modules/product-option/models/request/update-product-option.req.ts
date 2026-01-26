import type { ProductOptionValue } from '~/utils/types/product-option-value';

export type UpdateProductOptionReq = {
	name: string;
	values: ProductOptionValue[];
	metadata?: Record<string, unknown> | undefined;
};
