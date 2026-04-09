/** Body for POST create voucher; align with backend CreateVoucherDto. */
export type CreateVoucherReq = {
	code: string;
	name: string;
	description?: string;
	status: string;
	discount_code?: string;
	starts_at?: string;
	ends_at?: string;
	usage_limit?: number;
	metadata?: Record<string, unknown>;
};
