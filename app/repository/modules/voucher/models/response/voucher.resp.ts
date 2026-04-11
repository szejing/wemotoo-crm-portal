import type { Voucher } from '~/utils/types/voucher';

export type VoucherResp = {
	voucher: Voucher;
};

export type VouchersResp = {
	count: number;
	vouchers: Voucher[];
};
