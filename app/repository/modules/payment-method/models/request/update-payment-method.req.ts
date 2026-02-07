import type { PaymentMethodType } from 'wemotoo-common';

/** Request shape for updateStatus (code + is_active). */
export type UpdatePaymentMethodReq = {
	code: string;
	is_active: boolean;
};

/** PATCH body: only defined fields are sent (partial update). */
export type UpdatePaymentMethodBody = {
	desc?: string;
	short_desc?: string;
	logo?: string;
	is_active?: boolean;
	is_sandbox?: boolean;
	type?: PaymentMethodType;
	currency_code?: string;
	provider_code?: string;
	metadata?: Record<string, unknown>;
};
