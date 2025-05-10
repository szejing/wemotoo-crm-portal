export type OrderPaymentModel = {
	payment_line: number;
	payment_date: Date;
	payment_type_code: string;
	payment_type_desc: string;
	ref_no1: string;
	ref_no2: string;
	payment_amount: number;
	local_amount: number;
	currency_code: string;
	external_intg_type: number;
	metadata: Record<string, unknown>;
};
