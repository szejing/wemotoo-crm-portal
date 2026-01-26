export type TaxInput = {
	code: string;
};

export type Tax = {
	code: string;
	description: string;
	is_inclusive: boolean;
	is_active: boolean;
	metadata?: Record<string, unknown> | undefined;
};
