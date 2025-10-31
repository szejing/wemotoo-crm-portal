// Input type for create/update operations
export type ProductTypeInput = {
	id?: number;
	value: string;
	metadata?: Record<string, unknown>;
};

// Reference type for selections
export type ProductTypeRef = {
	id: number;
	value: string;
};

// Model type for display/read operations
export type ProductType = {
	id: number;
	value: string;
	total_items: number;
	metadata?: Record<string, unknown>;
};
