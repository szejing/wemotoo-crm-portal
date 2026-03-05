export type ProductVariationCreate = {
	name: string | undefined;
	options?: string[];
	metadata?: Record<string, unknown>;
};
