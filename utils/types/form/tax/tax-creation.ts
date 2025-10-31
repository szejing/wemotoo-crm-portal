export type TaxCreate = {
	code: string;
	description?: string;
	is_inclusive: boolean;
	is_active: boolean;
	metadata?: Record<string, unknown>;
};
