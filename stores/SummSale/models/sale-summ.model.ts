import { SaleStatus } from 'wemotoo-common';
import type { SummSaleBill } from '~/utils/types/summ-sales';

type SaleSumm = {
	filter: {
		start_date: Date;
		end_date: Date | undefined;
		filter_type: string;
		status: string;
		currency_code: string;
	};
	current_page: number;
	page_size: number;
	is_loading: boolean;
	data: SummSaleBill[];
};

export const initialEmptySaleSumm: SaleSumm = {
	filter: {
		start_date: new Date(),
		end_date: undefined,
		filter_type: '=',
		status: SaleStatus.COMPLETED,
		currency_code: 'MYR',
	},
	current_page: 1,
	page_size: 10,
	is_loading: false,
	data: [],
};
