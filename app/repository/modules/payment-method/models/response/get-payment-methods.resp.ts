import type { PaymentMethod } from '~/utils/types/payment-method';

export type GetPaymentMethodsResp = {
	methods: PaymentMethod[];
	count: number;
};

export type PaymentMethodResp = {
	method: PaymentMethod;
};
