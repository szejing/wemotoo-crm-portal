import type { FilterType, SaleStatus } from 'wemotoo-common';

export type GetSummSalePaymentsReq = {
	start_date: string;
	end_date?: string;
	filter_type: FilterType;
	status?: SaleStatus;
	// payment_status?: PaymentStatus;
	currency_code?: string;
};
