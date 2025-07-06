import { OrderStatus } from 'wemotoo-common';
import type { SummOrderBill } from '~/utils/types/summ-orders';

type OrderSumm = {
	filter: {
		start_date: Date;
		end_date: Date | undefined;
		filter_type: string;
		status: string;
		currency_code: string;
	};
	is_loading: boolean;
	page_size: number;
	current_page: number;
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
	is_loading: false,
	page_size: 10,
	current_page: 1,
	data: [],
};
