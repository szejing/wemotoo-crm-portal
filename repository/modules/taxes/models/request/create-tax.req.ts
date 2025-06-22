export type CreateTaxReq = {
	code: string | undefined;
	description: string | undefined;
	is_inclusive: boolean | undefined;
	is_active: boolean | undefined;
	metadata: Record<string, unknown> | undefined;
};
