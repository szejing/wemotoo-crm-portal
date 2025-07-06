import { OrderItemStatus, OrderStatus } from 'wemotoo-common';
import { options_page_size } from '~/utils/options';
import type { SummOrderItem } from '~/utils/types/summ-orders';

type OrderSummItem = {
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
	total_data: number;
	data: SummOrderItem[];
};

export const initialEmptyOrderSummItem: OrderSummItem = {
	filter: {
		start_date: new Date(),
		end_date: undefined,
		filter_type: '=',
		status: OrderStatus.NEW,
		item_status: OrderItemStatus.ACTIVE,
		currency_code: 'MYR',
	},
	is_loading: false,
	page_size: options_page_size[0],
	current_page: 1,
	total_data: 0,
	data: [],
};
