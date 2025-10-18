import { OrderStatus } from 'wemotoo-common';
import { options_page_size } from '~/utils/options';
import type { SummOrderBill } from '~/utils/types/summ-orders';

type OrderSumm = {
	filter: {
		start_date: Date;
		end_date: Date | undefined;
		filter_type: string;
		status: string;
		currency_code: string;
	};
	exporting: boolean;
	is_loading: boolean;
	page_size: number;
	current_page: number;
	total_data: number;
	data: SummOrderBill[];
};

export const initialEmptyOrderSumm: OrderSumm = {
	filter: {
		start_date: new Date(),
		end_date: undefined,
		filter_type: '=',
		status: OrderStatus.NEW,
		currency_code: 'MYR',
	},
	exporting: false,
	is_loading: false,
	page_size: options_page_size[0],
	current_page: 1,
	total_data: 0,
	data: [],
};
