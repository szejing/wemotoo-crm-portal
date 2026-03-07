import type { ProductOption, ProductOptionInput } from './product-option';

// Input type for create/update operations (max 2 variations per product)
export type ProductVariationInput = {
	id?: number;
	name: string;
	options: ProductOptionInput[];
	selected?: boolean;
};

// Model type for display/read: per-product variation set (variation id/name + scoped options only)
export type ProductVariation = {
	id: number;
	name: string;
	options: ProductOption[];
	created_at?: string;
	updated_at?: string;
};
