export type ProductTag = {
	id: number;

	value: string;

	total_items: number;

	metadata?: Record<string, unknown> | undefined;
};
