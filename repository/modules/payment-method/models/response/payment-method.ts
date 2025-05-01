import type { PaymentMethod } from '~/utils/types/payment-method';

export type GetPaymentMethodsResp = {
	methods: PaymentMethod[];
	count: number;
};
