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
	is_loading: false,
	data: [],
};
