import type { Bill } from '~/utils/types/bill';

export type GetSalesResp = {
	bills: Bill[];
	total: number;
};
