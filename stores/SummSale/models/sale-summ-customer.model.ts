import { SaleStatus } from 'wemotoo-common';
import type { SummSaleCustomer } from '~/utils/types/summ-sales';

type SaleSummCustomer = {
	filter: {
		start_date: Date;
		end_date: Date | undefined;
		filter_type: string;
		status: string;
		currency_code: string;
	};
	is_loading: boolean;
	data: SummSaleCustomer[];
};

export const initialEmptySaleSummCustomer: SaleSummCustomer = {
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
