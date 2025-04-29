import type { PaymentTypeGroup } from '~/utils/types/payment-type';

export type GetPaymentTypeGroupsResp = {
	groups: PaymentTypeGroup[];
	count: number;
};
