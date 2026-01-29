// Input type for create/update operations
export type PaymentTypeInput = {
	code: string;
	desc: string;
	short_desc?: string;
	currency_code: string;
	metadata?: Record<string, unknown>;
};

// Reference type for selections
export type PaymentTypeRef = {
	code: string;
	desc: string;
};

// Model type for display/read operations
export type PaymentType = {
	code: string;
	desc: string;
	short_desc: string;
	currency_code: string;
	metadata: Record<string, unknown>;
	created_at?: string;
	updated_at?: string;
};

// Input type for payment type group
export type PaymentTypeGroupInput = {
	code: string;
	desc: string;
	short_desc?: string;
	payment_type_codes?: string[];
	metadata?: Record<string, unknown>;
};

// Model type for payment type group
export type PaymentTypeGroup = {
	code: string;
	desc: string;
	short_desc: string;
	metadata: Record<string, unknown>;
	payment_types: PaymentType[];
	created_at?: string;
	updated_at?: string;
};
