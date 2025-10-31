// Input type for create/update operations
export type ProductOptionValueInput = {
	id?: number;
	option_id?: number;
	value: string;
	metadata?: Record<string, unknown>;
};

// Model type for display/read operations
export type ProductOptionValue = {
	id: number;
	option_id: number;
	value: string;
	metadata?: Record<string, unknown>;
	created_at?: string;
	updated_at?: string;
};
