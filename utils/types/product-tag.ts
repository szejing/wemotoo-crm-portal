export type ProductTag = {
	id: string;
	name: string;

	no_of_items: number;

	metadata?: Record<string, unknown> | undefined;
};
