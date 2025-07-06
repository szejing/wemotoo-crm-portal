import type { SummSaleBill } from '~/utils/types/summ-sales';

export type GetSummSalesResp = {
	summ_sales: SummSaleBill[];
	total: number;
};
