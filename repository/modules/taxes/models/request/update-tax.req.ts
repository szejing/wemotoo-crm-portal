export type UpdateTaxReq = {
	description: string | undefined;
	is_inclusive: boolean | undefined;
	is_active: boolean | undefined;
	metadata: Record<string, unknown> | undefined;
};
