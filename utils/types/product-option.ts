import type { ProductOptionValue } from './product-option-value';

export type ProductOption = {
	id: number;
	name: string;
	values: ProductOptionValue[];
};
