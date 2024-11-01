export type ProductTag = {
	id: string;

	value: string;

	total_items: number;

	metadata?: Record<string, unknown> | undefined;
};
