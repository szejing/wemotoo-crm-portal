import type { ProductOption, ProductOptionInput } from './product-option';

// Input type for create/update operations
export type ProductVariationInput = {
	id?: number;
	name: string;
	options: ProductOptionInput[];
	selected?: boolean;
};

// Model type for display/read operations
export type ProductVariation = {
	id: number;
	name: string;
	options: ProductOption[];
	created_at?: string;
	updated_at?: string;
};
