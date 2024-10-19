export type ProductOptionCreate = {
	// name
	name: string | undefined;

	values: string[] | undefined;

	metadata?: Record<string, unknown> | undefined;
};
