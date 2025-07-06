import { OrderItemStatus, SaleStatus } from 'wemotoo-common';
import type { SummSaleItem } from '~/utils/types/summ-sales';

type SaleSummItem = {
	filter: {
		start_date: Date;
		end_date: Date | undefined;
		filter_type: string;
		status: string;
		item_status: string;
		currency_code: string;
	};
	is_loading: boolean;
	page_size: number;
	current_page: number;
	data: SummSaleItem[];
};

export const initialEmptySaleSummItem: SaleSummItem = {
	filter: {
		start_date: new Date(),
		end_date: undefined,
		filter_type: '=',
		status: SaleStatus.COMPLETED,
		item_status: OrderItemStatus.ACTIVE,
		currency_code: 'MYR',
	},
	is_loading: false,
	page_size: 10,
	current_page: 1,
	data: [],
};
