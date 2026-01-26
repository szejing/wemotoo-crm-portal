import { options_page_size } from '~/utils/options';
import type { SummOrderBill } from '~/utils/types/summ-orders';
import type { Range } from '~/utils/interface';
import type { OrderStatus } from 'wemotoo-common';
import { sub } from 'date-fns';

type OrderSumm = {
	filter: {
		date_range: Range;
		status: OrderStatus | undefined;
		currency_code: string;
	};
	exporting: boolean;
	loading: boolean;
	page_size: number;
	current_page: number;
	total_data: number;
	data: SummOrderBill[];
};

export const initialEmptyOrderSumm: OrderSumm = {
	filter: {
		date_range: {
			start: sub(new Date(), { days: 14 }),
			end: new Date(),
		},
		status: undefined,
		currency_code: 'MYR',
	},
	exporting: false,
	loading: false,
	page_size: options_page_size[0] as number,
	current_page: 1,
	total_data: 0,
	data: [],
};
