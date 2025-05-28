import type { Transaction } from './transaction';

export type GetSalesResp = {
	transactions: Transaction[];
	total: number;
};
