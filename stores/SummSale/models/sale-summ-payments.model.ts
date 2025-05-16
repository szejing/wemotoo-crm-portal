import { PaymentStatus, SaleStatus } from 'wemotoo-common';
import type { SummSalePayment } from '~/utils/types/summ-sales';

type SaleSummPayment = {
	filter: {
		start_date: Date;
		end_date: Date | undefined;
		filter_type: string;
		status: string;
		payment_status: string;
		currency_code: string;
	};
	is_loading: boolean;
	data: SummSalePayment[];
};

export const initialEmptySaleSummPayment: SaleSummPayment = {
	filter: {
		start_date: new Date(),
		end_date: undefined,
		filter_type: '=',
		status: SaleStatus.COMPLETED,
		payment_status: PaymentStatus.SUCCESS,
		currency_code: 'MYR',
	},
	is_loading: false,
	data: [],
};
