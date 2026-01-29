export type ProductOptionCreate = {
	name: string | undefined;
	values?: string[];
	metadata?: Record<string, unknown>;
};
