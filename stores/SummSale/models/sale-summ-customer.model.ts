import type { SaleStatus } from 'wemotoo-common';
import { options_page_size } from '~/utils/options';
import type { SummSaleCustomer } from '~/utils/types/summ-sales';
import type { Range } from '~/utils/interface';
import { sub } from 'date-fns';

type SaleSummCustomer = {
	filter: {
		date_range: Range;
		status: SaleStatus | undefined;
		currency_code: string;
	};
	exporting: boolean;
	loading: boolean;
	page_size: number;
	current_page: number;
	total_data: number;
	data: SummSaleCustomer[];
};

export const initialEmptySaleSummCustomer: SaleSummCustomer = {
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
