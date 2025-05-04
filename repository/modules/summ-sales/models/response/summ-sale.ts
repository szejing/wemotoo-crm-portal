import type { SummOrderBill } from '~/utils/types/summ-orders';

export type GetSummSalesResp = {
	summ_sales: SummOrderBill[];
	total: number;
};
