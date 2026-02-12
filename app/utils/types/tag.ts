export type TagInput = {
	id: number;
	value?: string;
};

export type Tag = {
	id: number;
	value: string;
	is_active?: boolean;
	is_internal?: boolean;
	total_products: number;
	metadata?: Record<string, unknown> | undefined;
};
