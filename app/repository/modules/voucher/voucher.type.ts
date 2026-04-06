import type { BaseODataResp } from '~/repository/base/base.resp';

export interface CreateVoucherRequest {
	code: string;
	name: string;
	description?: string;
	status: string;
	discount_code?: string;
	starts_at?: string;
	ends_at?: string;
	usage_limit?: number;
}

export type UpdateVoucherRequest = Partial<CreateVoucherRequest>;

export interface VoucherResponse {
	code: string;
	name: string;
	description: string | null;
	status: string;
	discount_code: string | null;
	starts_at: string | null;
	ends_at: string | null;
	usage_limit: number | null;
	usage_count: number;
	created_at: string;
	updated_at: string;
}

export type BaseVoucherResponse = VoucherResponse;
export type PaginatedVoucherResponse = BaseODataResp<VoucherResponse>;
