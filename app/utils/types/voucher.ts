import type { Discount } from './discount';

export type Voucher = {
	code: string;
	description?: string;
	is_disabled: boolean;
	/** API JSON may deserialize these as ISO strings; treat as either until parsed. */
	starts_at: Date | string | null;
	ends_at: Date | string | null;
	usage_limit: number | null;
	usage_count: number;
	usage_per_customer: number | null;
	created_at: string;
	updated_at: string;
	discount: Discount;
};
