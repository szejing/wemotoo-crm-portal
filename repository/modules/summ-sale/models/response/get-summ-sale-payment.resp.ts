import type { SummSalePayment } from '~/utils/types/summ-sales';

export type GetSummSalePaymentsResp = {
	summ_sale_payments: SummSalePayment[];
	total: number;
};
