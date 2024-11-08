import type { ProductOptionValue } from './product-option-value';

export type ProductOption = {
	id: string;
	name: string;
	values: ProductOptionValue[];
};
