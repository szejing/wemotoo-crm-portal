import type { CreateDiscountReq } from '~/repository/modules/discount/models/request/create-discount.req';

/** Body for POST create voucher; align with backend CreateVoucherDto. */
export type CreateVoucherReq = {
	code: string;
	description?: string;
	discount_code?: string;
	is_disabled?: boolean;
	starts_at?: string;
	ends_at?: string;
	usage_limit?: number;
	metadata?: Record<string, unknown>;
	/** When set, backend creates this discount with the same code as the voucher and links it. */
	create_discount?: Omit<CreateDiscountReq, 'code'> & { code?: string };
};
