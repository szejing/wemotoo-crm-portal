import { SaleStatus } from 'wemotoo-common';
import { options_page_size } from '~/utils/options';
import type { SummSaleBill } from '~/utils/types/summ-sales';

type SaleSumm = {
	filter: {
		start_date: Date;
		end_date: Date | undefined;
		filter_type: string;
		status: string;
		currency_code: string;
	};
	exporting: boolean;
	current_page: number;
	page_size: number;
	is_loading: boolean;
	data: SummSaleBill[];
	total_data: number;
};

export const initialEmptySaleSumm: SaleSumm = {
	filter: {
		start_date: new Date(),
		end_date: undefined,
		filter_type: '=',
		status: SaleStatus.COMPLETED,
		currency_code: 'MYR',
	},
	exporting: false,
	current_page: 1,
	page_size: options_page_size[0] as number,
	is_loading: false,
	data: [],
	total_data: 0,
};
