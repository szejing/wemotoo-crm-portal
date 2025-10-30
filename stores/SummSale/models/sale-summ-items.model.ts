import { OrderItemStatus, SaleStatus } from 'wemotoo-common';
import { options_page_size } from '~/utils/options';
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
	exporting: boolean;
	is_loading: boolean;
	page_size: number;
	current_page: number;
	total_data: number;
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
	exporting: false,
	is_loading: false,
	page_size: options_page_size[0] as number,
	current_page: 1,
	total_data: 0,
	data: [],
};
