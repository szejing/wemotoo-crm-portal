import type { ProductOption } from '~/utils/types/product-option';

export type UpdateProductOptionReq = {
	name: string;
	options: ProductOption[];
	metadata?: Record<string, unknown> | undefined;
};
