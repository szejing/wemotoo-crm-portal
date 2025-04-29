export type PaymentType = {
	code: string;
	desc: string;
	short_desc: string;
	currency_code: string;
	metadata: Record<string, unknown>;
};

export type PaymentTypeGroup = {
	code: string;
	desc: string;
	short_desc: string;
	metadata: Record<string, unknown>;
	payment_types: PaymentType[];
};
