export type TagInput = {
	id: number;
	value?: string;
};

export type Tag = {
	id: number;
	value: string;
	total_products: number;
	metadata?: Record<string, unknown> | undefined;
};
