import type { PaymentMethodType } from 'wemotoo-common';

// Input type for create/update operations
export type PaymentMethodInput = {
	code: string;
	desc: string;
	short_desc?: string;
	logo?: string;
	is_active: boolean;
	is_sandbox: boolean;
	type: PaymentMethodType;
	currency_code: string;
	provider_code: string;
	metadata?: Record<string, unknown>;
};

// Reference type for selections
export type PaymentMethodRef = {
	code: string;
	desc: string;
	type: PaymentMethodType;
};

// Model type for display/read operations
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
	created_at?: string;
	updated_at?: string;
};
