// Input type for create/update operations
export type ProductOptionInput = {
	id?: number;
	variation_id?: number;
	value: string;
	metadata?: Record<string, unknown>;
};

// Model type for display/read operations
export type ProductOption = {
	id: number;
	variation_id: number;
	value: string;
	metadata?: Record<string, unknown>;
	created_at?: string;
	updated_at?: string;
};
