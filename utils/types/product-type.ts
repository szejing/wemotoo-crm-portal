export type ProductType = {
	id: number;
	value: string;
	total_items: number;
	metadata?: Record<string, unknown> | undefined;
};
