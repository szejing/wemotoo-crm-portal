import type { Discount } from './discount';

export type Voucher = {
	code: string;
	description?: string;
	is_disabled: boolean;
	starts_at: Date | null;
	ends_at: Date | null;
	usage_limit: number | null;
	usage_count: number;
	usage_per_customer: number | null;
	created_at: string;
	updated_at: string;
	discount: Discount;
};
