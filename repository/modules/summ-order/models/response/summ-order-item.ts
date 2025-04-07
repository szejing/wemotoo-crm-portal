import type { SummOrderItem } from '~/utils/types/summ-orders';

export type GetSummOrderItemsResp = {
	summ_order_items: SummOrderItem[];
	total: number;
};
