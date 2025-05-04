import type { SummSaleItem } from '~/utils/types/summ-sales';

export type GetSummSalesItemsResp = {
	summ_sale_items: SummSaleItem[];
	total: number;
};
