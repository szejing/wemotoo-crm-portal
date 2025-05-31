import { OrderItemStatus, OrderStatus } from 'wemotoo-common';
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
	data: [],
};
