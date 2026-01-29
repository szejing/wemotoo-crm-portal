import type { ProductType } from '~/utils/types/product-type';

export type ProductTypesResp = {
	count: number;
	productTypes: ProductType[];
};
