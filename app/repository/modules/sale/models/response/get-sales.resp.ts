import type { Bill } from './bill';

export type GetSalesResp = {
	bills: Bill[];
	total: number;
};
