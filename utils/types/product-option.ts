import type { ProductOptionValue } from './product-option-value';

export type ProductOption = {
	id: number | undefined;
	name: string | undefined;
	values: ProductOptionValue[];
};
