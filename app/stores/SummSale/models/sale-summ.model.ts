import type { SaleStatus } from 'wemotoo-common';
import { options_page_size } from '~/utils/options';
import type { SummSaleBill } from '~/utils/types/summ-sales';
import type { Range } from '~/utils/interface';
import { sub } from 'date-fns';

type SaleSumm = {
	filter: {
		date_range: Range;
		status: SaleStatus | undefined;
		currency_code: string;
	};
	exporting: boolean;
	current_page: number;
	page_size: number;
	loading: boolean;
	data: SummSaleBill[];
	total_data: number;
};

export const initialEmptySaleSumm: SaleSumm = {
	filter: {
		date_range: {
			start: sub(new Date(), { days: 14 }),
			end: new Date(),
		},
		status: undefined,
		currency_code: 'MYR',
	},
	exporting: false,
	current_page: 1,
	page_size: options_page_size[0] as number,
	loading: false,
	data: [],
	total_data: 0,
};
