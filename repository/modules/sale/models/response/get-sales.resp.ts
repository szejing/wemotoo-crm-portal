import type { Sale } from './sale';

export type GetSalesResp = {
	sales: Sale[];
	total: number;
};
