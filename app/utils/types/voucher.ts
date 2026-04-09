export type Voucher = {
	code: string;
	name: string;
	description: string;
	status: string;
	discount_code: string;
	starts_at: string;
	ends_at: string;
	usage_limit: number;
	usage_count: number;
	created_at: string;
	updated_at: string;
	metadata?: Record<string, unknown>;
};
