/** Mutable UForm state for voucher create/update flows. */
export type VoucherFormState = {
	code: string;
	name?: string;
	description?: string;
	is_disabled: boolean;
	discount_code?: string;
	starts_at?: string;
	ends_at?: string;
	usage_limit?: number;
};
