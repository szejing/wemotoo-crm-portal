import type { ProductOption } from '~/utils/types/product-option';

export type UpdateProductOptionReq = {
	name: string;
	values: ProductOption[];
	metadata?: Record<string, unknown> | undefined;
};
