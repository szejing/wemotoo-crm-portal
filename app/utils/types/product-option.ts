import type { ProductOptionValue, ProductOptionValueInput } from './product-option-value';

// Input type for create/update operations
export type ProductOptionInput = {
	id?: number;
	name: string;
	values: ProductOptionValueInput[];
	selected?: boolean;
};

// Model type for display/read operations
export type ProductOption = {
	id: number;
	name: string;
	values: ProductOptionValue[];
	created_at?: string;
	updated_at?: string;
};
