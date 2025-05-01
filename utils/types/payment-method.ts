import type { PaymentMethodType } from 'wemotoo-common';

export type PaymentMethod = {
	code: string;
	desc: string;
	short_desc: string;
	logo: string;
	is_active: boolean;
	is_sandbox: boolean;
	type: PaymentMethodType;
	currency_code: string;
	provider_code: string;
	metadata: Record<string, unknown>;
};
