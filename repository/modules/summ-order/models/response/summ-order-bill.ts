import type { SummOrderBill } from '~/utils/types/summ-orders';

export type GetSummOrderBillsResp = {
	summ_orders: SummOrderBill[];
	total: number;
};
